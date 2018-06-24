<script>
const src = require('./images/logo.png')

export default {
  functional: true,
  render () {
    return (
      <header>
        <img src={src} alt="vue music player" />
        vue music player
      </header>
    )
  }
}
</script>

<style lang="scss">
header {
  display: flex;
  align-items: center;
  height: 50px;
  border-bottom:2px solid rgb(107, 201, 79);
  font-size: 25px;
  font-weight: bold;
  img {
    height: 80%;
  }
}
</style>
