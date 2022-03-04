<div id="top"></div>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

[//]: # ([![LinkedIn][linkedin-shield]][linkedin-url])



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/semycolon/medium">
    <img src="https://raw.githubusercontent.com/semycolon/medium/master/assets/icons/dynamic/icon-logo.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Medium Clone</h3>

  <p align="center">
    yet another Medium Clone made with Node.js and Vue
    <br />
    <a href="https://github.com/semycolon/medium/tree/master/docs"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://codeify.ir/">View Demo</a>
    ·
    <a href="https://github.com/semycolon/medium/issues">Report Bug</a>
    ·
    <a href="https://github.com/semycolon/medium/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://image.thum.io/get/maxAge/12/width/700/height/500https://codeify.ir) -->

While there are many great blog posts available on GitHub, I couldn't find one that fits my needs, so I created my own.

An ideal blog would be: 
- light, not bloated with tons of unnecessary features 
- fast, easy to deploy 
- elegant and simple to use


<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [Vite-SSR-Plugin](https://vite-plugin-ssr.com/)
* [Prisma.io](https://www.prisma.io/)
* [Vue.js](https://vuejs.org/)
* [TailwindsCSS](https://vuejs.org/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started
To get a local copy up and running follow these simple example steps.

### Development

This is an example of how to list things you need to use the software and how to install them.
1. Clone the repo
   ```sh
   git clone https://github.com/semycolon/medium.git
   cd medium
   ```

2. Configure Envronment Variables 
   ```sh
   cp .env.example .env
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Generate PrismaClient
   ```sh
   npm run prisma:gen
   ```
5. Apply schema to database
   ```sh
   npm run prisma:deploy
   ```
5. Run Application
   ```sh
   npm run dev
   ```
   
   
### Production

1. Clone the repo
   ```sh
   git clone https://github.com/semycolon/medium.git
   cd medium
   ```
2. Configure Envronment Variables 
   ```sh
   cp .env.example .env
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Generate PrismaClient
   ```sh
   npm run build
   ```
5. Run Application
   ```sh
   npm run start
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/codeify_ir) - Asheghi.sh@gmail.com

Project Link: [https://github.com/semycolon/medium](https://github.com/semycolon/medium)

<p align="right">(<a href="#top">back to top</a>)</p>



[//]: # (<!-- ACKNOWLEDGMENTS -->)

[//]: # (## Acknowledgments)

[//]: # ()
[//]: # (Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!)

[//]: # ()
[//]: # (* [Choose an Open Source License]&#40;https://choosealicense.com&#41;)

[//]: # (* [GitHub Emoji Cheat Sheet]&#40;https://www.webpagefx.com/tools/emoji-cheat-sheet&#41;)

[//]: # (* [Malven's Flexbox Cheatsheet]&#40;https://flexbox.malven.co/&#41;)

[//]: # (* [Malven's Grid Cheatsheet]&#40;https://grid.malven.co/&#41;)

[//]: # (* [Img Shields]&#40;https://shields.io&#41;)

[//]: # (* [GitHub Pages]&#40;https://pages.github.com&#41;)

[//]: # (* [Font Awesome]&#40;https://fontawesome.com&#41;)

[//]: # (* [React Icons]&#40;https://react-icons.github.io/react-icons/search&#41;)

[//]: # ()
[//]: # (<p align="right">&#40;<a href="#top">back to top</a>&#41;</p>)



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/semycolon/medium.svg?style=for-the-badge
[contributors-url]: https://github.com/semycolon/medium/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/semycolon/medium.svg?style=for-the-badge
[forks-url]: https://github.com/semycolon/medium/network/members
[stars-shield]: https://img.shields.io/github/stars/semycolon/medium.svg?style=for-the-badge
[stars-url]: https://github.com/semycolon/medium/stargazers
[issues-shield]: https://img.shields.io/github/issues/semycolon/medium.svg?style=for-the-badge
[issues-url]: https://github.com/semycolon/medium/issues
[license-shield]: https://img.shields.io/github/license/semycolon/medium.svg?style=for-the-badge
[license-url]: https://github.com/semycolon/medium/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com
[product-screenshot]: images/screenshot.png
