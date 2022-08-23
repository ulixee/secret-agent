<template>
  <BasicLayout class="Home">
    <div class="notice">
      <p>
        NOTE: SecretAgent 2.0 is named <a href="https://ulixee.org/docs/hero">Hero</a> and
        is currently in alpha testing. We're ready for developers to begin to switch over - it's a
        pretty easy transition (<a href="https://ulixee.org/docs/hero/help/migration-guide"
      >migration guide</a
      >). Follow along with development of Hero
        <a href="https://github.com/ulixee/hero">here</a> or check out the latest npm packages
        `@ulixee/hero-playground`.
      </p>
    </div>
    <Section container="md" dots="true">
      <div class="post-header container-md mb-x2">
        <h1>The Web Browser  Built for Scraping</h1>
        <p>
          SecretAgent is a headless browser that’s nearly impossible to detect. It achieves this by
          emulating real users. And it has powerful auto-replay functionality that lets you create
          and debug scripts in record setting time.
        </p>
        <a class="button" href="/docs"> Get Started</a>
      </div>
    </Section>

  </BasicLayout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class Home extends Vue {
  public mounted() {
    document.body.setAttribute('data-theme', 'dark');
  }

  public destroyed() {
    document.body.removeAttribute('data-theme');
  }
}
</script>

<style lang="scss">
.Home {
  text-align: center;
  h1 {
    font-size: 5.9rem;
  }
  p {
    padding: 0 25px;
    font-size: 1.3rem;
  }
  .el-row {
    height: calc(100vh - 200px);
  }
  .Content {
    min-height: calc(100vh - 129px);
  }
  .section {
    padding:0;
  }

  a.button {
    margin-top: 20px;
    padding: 13px 70px;
    font-size: 1.1rem;
  }

  .notice {
    margin-bottom: 60px;
    box-sizing: border-box;
    background-color: #ebf4f1;
    border-radius: 10px;
    padding: 20px;
    color: rgba(0, 0, 0, 0.8);
    p {
      padding: 7px 45px;

    }
  }
}
</style>
