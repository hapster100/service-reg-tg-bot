<script lang='ts'>
  import Icon from "./Icon.svelte";

  export let imageUrl: string

  const handleImage = (e: Event & { currentTarget: HTMLInputElement }) => {
    const file = e.currentTarget?.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const img = new Image()
        img.src = reader.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = 400
          canvas.height = 400

          let dx = 0, dy = 0, w = img.width, h = img.height
          
          if (w/h > 1) {
            dx = Math.floor(w/2 - h/2)
            w = h
          } else if (w/h < 1) {
            dy = Math.floor(h/2 - w/2)
            h = w
          }

          canvas.getContext('2d')?.drawImage(
            img, dx, dy, w, h,
            0, 0, canvas.width, canvas.height
          )
          
          
          imageUrl = canvas.toDataURL()
        }
      });
      reader.readAsDataURL(file);
    }
  }
</script>

<input type="file"
  id="image" name="image"
  accept="image/png, image/jpeg"
  on:change={handleImage}
>
{#if imageUrl}
  <div class="img-wrapper">
    <img class="img-preview" src={imageUrl} alt="" />
    <button class="clear-btn" on:click={_ => imageUrl = ''}>
      <Icon icon="delete"/>
    </button>
  </div>
{/if}

<style>
  input[type="file"] {
    border: 0;
  }
  .img-wrapper {
    width: 100%;
    aspect-ratio: 1.21;
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 8px;
    border: 1px solid var(--color-text)
  }
  
  .clear-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 50px;
    height: 50px;
    border-radius: 0;
    border-top-left-radius: 8px;
  }

  .img-preview {
    width: 100%;
    object-fit: cover;
    aspect-ratio: 1.2;
  }
</style>