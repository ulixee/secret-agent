<template lang="pug">
CoreLayout.has-sidebar.DocsPage(:footer="false")
  .container.flex.flex-align-top
    .sidebar
      //.doc-switcher
        .select.api.has-dropdown
          .title {{linksTitle(linksType)}}
          .dropdown(ref="linksDropdownElem")
            a(href="/docs/core")
              | {{linksTitle('core')}}
            a(href="/docs/dynamic-dom")
              | {{linksTitle('dynamic')}}
            a(href="/docs/static-dom")
              | {{linksTitle('static')}}
            a(href="/docs/complete-dom")
              | {{linksTitle('complete')}}
        .select.version.has-dropdown
          .title 1.0
          .dropdown(ref="versionDropdownElem")
            a(@click="closeDropdown($refs.versionDropdownElem)")
              | 1.0
      template(v-if="links" v-for="(group, i1) in links")
        h3.menu-item(:key="`title-${i1}`") {{ group.title }}
        template(v-for="(item, i2) in group.items")
          template(v-if="item.items")
            h4.menu-item(:key="`title-${i1}-${i2}`") {{item.title}}
            template(v-for="(itm, i3) in item.items")
              g-link.menu-item.menu-link(:exact="itm.link == '/docs/'" :to="itm.link" :key="`link-${i1}-${i2}-${i3}`")
                | {{ itm.title }}
          template(v-else)
            g-link.menu-item.menu-link(:exact="item.link == '/docs/'" :to="item.link" :key="`link-${i1}-${i2}`")
              | {{ item.title }}

    Section.doc-content.flex-fit(container="base")
      VueRemarkContent(class="post mb")
      p
        a.github-edit-link(:href="editLink" target="_blank")
          GithubLogo
          span Edit this page on GitHub
      nav.docs-nav
        .docs-nav__previous
          g-link.button.button--small.docs-nav__link(v-if="previousPage" exact :to="previousPage.link")
            | &larr; {{ previousPage.title }}
        .docs-nav__next
          g-link.button.button--small.docs-nav__link(v-if="nextPage" exact :to="nextPage.link")
            | {{ nextPage.title }} &rarr;

    .sidebar.sidebar--right.hide-for-small
      template(v-if="subtitles.length > 0 && subtitles[0].depth !== 3")
        h3 On this page
        ul.menu-item.submenu(v-if="subtitles.length")
          li.submenu__item(:class="'submenu__item-depth-' + subtitle.depth" v-for="subtitle in subtitles" :key="subtitle.value")
            a.submenu__link(:href="subtitle.anchor") {{ subtitle.value }}
</template>

<page-query>
  query ($id: ID!) {
    record: docs (id: $id) {
      title
      headings (depth: h1) {
        value
      }
      subtitles: headings {
        depth
        value
        anchor
      }
    }
  }
</page-query>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator';
  import GithubLogo from '~/assets/logos/github.svg';
  import generateLinks from '../lib/generateLinks';

  const links = generateLinks();

  @Component({
    metaInfo() {
      // @ts-ignore
      const { title, headings } = this.$page.record;
      return {
        title: title || (headings.length ? headings[0].value : undefined),
      };
    },
    components: {
      GithubLogo
    },
  })
  export default class DocsPage extends Vue {
    public $page: any;
    public $route: any;
    public links: any[] = links;

    private get subtitles() {
      // Remove h1, h4, h5, h6 titles
      let subtitles = this.$page.record.subtitles.filter(function(value: any, index: any, arr: any) {
        return [2, 3].includes(value.depth);
      });
      return subtitles;
    }

    private get currentPath() {
      return this.$route.matched[0].path;
    }

    private get editLink() {
      let path = this.currentPath;
      if ((path.match(new RegExp('/', 'g')) || []).length == 1) path = path + '/README';
      return `https://github.com/ulixee/secret-agent/blob/master/website${path}.md`;
    }

    private get items() {
      const items = [];
      for (const group of this.links) {
        items.push({ title: group.title, link: group.link });
        for (const item of group.items) {
          items.push({ title: item.title, link: item.link });
          if (item.items) items.push(...item.items);
        }
      }
      return items;
    }
    private get currentIndex() {
      return this.items.findIndex(item => {
        return item.link.replace(/\/$/, '') === this.$route.path.replace(/\/$/, '');
      });
    }

    private get nextPage() {
      return this.items[this.currentIndex + 1];
    }

    private get previousPage() {
      return this.items[this.currentIndex - 1];
    }
  }
</script>

<style lang="scss">
  @import "../assets/style/reset";

  .DocsPage {
    ul.methods, ul.properties {
      @include reset-ul();
      & > li {
        margin-bottom: 20px;
        & > a {
          font-weight: bold;
          background-color: rgba(220,220,220,.5);
          font-size: 1rem;
        }
        & > div {
          margin-left: 10px;
        }
      }
    }
  }
</style>