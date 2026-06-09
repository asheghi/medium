const readline = require('readline/promises');
const { stdin, stdout } = require('process');
const { prisma } = require('../server/lib/prisma');
const { hashPassword } = require('../server/lib/password');

function readArgument(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function promptHidden(label) {
  if (!stdin.isTTY || !stdin.setRawMode) {
    const rl = readline.createInterface({ input: stdin, output: stdout });
    try {
      return await rl.question(label);
    } finally {
      rl.close();
    }
  }

  stdout.write(label);
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');
  return new Promise((resolve, reject) => {
    let value = '';
    function finish(error) {
      stdin.setRawMode(false);
      stdin.pause();
      // eslint-disable-next-line no-use-before-define
      stdin.removeListener('data', onData);
      stdout.write('\n');
      if (error) reject(error); else resolve(value);
    }
    function onData(character) {
      if (character === '\u0003') return finish(new Error('Cancelled'));
      if (character === '\r' || character === '\n') return finish();
      if (character === '\u007f') {
        value = value.slice(0, -1);
        return undefined;
      }
      value += character;
      return undefined;
    }
    stdin.on('data', onData);
  });
}

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  let email = readArgument('email') || process.env.ADMIN_EMAIL;
  try {
    if (!email) email = await rl.question('Admin email: ');
  } finally {
    rl.close();
  }
  email = email.trim().toLowerCase();
  const password = readArgument('password') || process.env.ADMIN_PASSWORD || await promptHidden('Admin password: ');

  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('A valid admin email is required');
  if (password.length < 12 || password.length > 200) throw new Error('Password must be between 12 and 200 characters');

  const existing = await prisma.user.findFirst();
  if (existing && existing.email !== email) {
    throw new Error(`This single-author blog already has an admin: ${existing.email}`);
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, passwordVersion: { increment: 1 } },
    create: { email, passwordHash },
  });
  await prisma.session.deleteMany({ where: { userId: user.id } });
  stdout.write(`Admin account ready for ${user.email}. Existing sessions were revoked.\n`);
}

main()
  .catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
