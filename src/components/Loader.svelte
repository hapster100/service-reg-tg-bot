<div class="loader-wrapper fullw">
  <div class='loader'></div>
</div>

<style>
  .loader-wrapper {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @keyframes load {
    0%,11% {
      border-color: var(--color-text) transparent transparent transparent;
    }
    12%,23% {
      border-color: var(--color-text) var(--color-text) transparent transparent;
    }
    24%,35% {
      border-color: var(--color-text) var(--color-text) var(--color-text) transparent;
    }
    36%,47% {
      border-color: var(--color-text) var(--color-text) var(--color-text) var(--color-text);
    }
    48%,60% {
      border-color: transparent var(--color-text) var(--color-text) var(--color-text);
    }
    61%, 71% {
      border-color: transparent transparent var(--color-text) var(--color-text);
    }
    72%,83% {
      border-color: transparent transparent transparent var(--color-text);
    }
    84%, 99% {
      border-color: transparent;
    }
    100% {
      border-color: var(--color-text) transparent transparent transparent;
    }
  }

  .loader {
    box-sizing: border-box;
    height: 0px;
    width: 0px;
    background-color: var(--color-bg);
    border: 40px solid var(--color-text);
    border-radius: 50%;
    animation: load 3s infinite;
  }
</style>
