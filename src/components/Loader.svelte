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
      border-color: black transparent transparent transparent;
    }
    12%,23% {
      border-color: black black transparent transparent;
    }
    24%,35% {
      border-color: black black black transparent;
    }
    36%,47% {
      border-color: black black black black;
    }
    48%,60% {
      border-color: transparent black black black;
    }
    61%, 71% {
      border-color: transparent transparent black black;
    }
    72%,83% {
      border-color: transparent transparent transparent black;
    }
    84%, 99% {
      border-color: transparent;
    }
    100% {
      border-color: black transparent transparent transparent;
    }
  }

  .loader {
    box-sizing: border-box;
    height: 0px;
    width: 0px;
    background-color: white;
    border: 40px solid black;
    border-radius: 50%;
    animation: load 3s infinite;
  }
</style>
