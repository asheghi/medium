import { defineComponent, h } from 'vue';
import ExclamationIcon from '../assets/icons/dynamic/icon-warning.svg';
import LoadingIcon from '../assets/icons/dynamic/icon-void.svg';

export default defineComponent({
  name: 'DynamicIcon',
  props: {
    icon: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      module: null,
      error: false,
    };
  },
  watch: {
    icon() {
      this.fetchIcon();
    },
  },
  created() {
    this.fetchIcon();
  },
  methods: {
    fetchIcon() {
      import(`../assets/icons/dynamic/icon-${this.icon}.svg`)
        .then((mod) => {
          this.module = mod.default || mod;
        })
        .catch((e) => {
          this.error = true;
        });
    },
  },
  render() {
    if (this.error) {
      return ExclamationIcon;
    }
    if (this.module) {
      return h(this.module);
    }
    return h(LoadingIcon);
  },
});
