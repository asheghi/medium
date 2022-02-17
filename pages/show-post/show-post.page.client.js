import '../../assets/styles/tailwind.css';
import '../../assets/styles/post.scss';
import hljs from 'highlight.js/lib/common';

document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('pre code').forEach((el) => {
    hljs.highlightElement(el);
  });
});
