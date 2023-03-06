<script lang='ts'>
  export let dayStart : number = 0
  export let dayEnd : number = 1
  export let breakStart : number = 0.4
  export let breakEnd : number = 0.5

  let interval: HTMLElement|null = null

  function draggable(node) {
		let x;
		let y;
		function handleMousedown(event) {
			if (event.type === 'touchstart') {
				event = event.touches[0];
			}
			x = event.clientX;
			y = event.clientY;
			node.dispatchEvent(new CustomEvent('dragstart', {
				detail: { x, y }
			}));
			window.addEventListener('mousemove', handleMousemove);
			window.addEventListener('mouseup', handleMouseup);
			window.addEventListener('touchmove', handleMousemove);
			window.addEventListener('touchend', handleMouseup);
		}
		function handleMousemove(event) {
			if (event.type === 'touchmove') {
				event = event.changedTouches[0];
			}
			const dx = event.clientX - x;
			const dy = event.clientY - y;
			x = event.clientX;
			y = event.clientY;
			node.dispatchEvent(new CustomEvent('dragmove', {
				detail: { x, y, dx, dy }
			}));
		}
		function handleMouseup(event) {
			x = event.clientX;
			y = event.clientY;
			node.dispatchEvent(new CustomEvent('dragend', {
				detail: { x, y }
			}));
			window.removeEventListener('mousemove', handleMousemove);
			window.removeEventListener('mouseup', handleMouseup);
			window.removeEventListener('touchmove', handleMousemove);
			window.removeEventListener('touchend', handleMouseup);
		}
		node.addEventListener('mousedown', handleMousedown);
		node.addEventListener('touchstart', handleMousedown);
		return {
			destroy() {
				node.removeEventListener('mousedown', handleMousedown);
				node.removeEventListener('touchstart', handleMousedown);
			}
		};
	}
  function setHandlePosition (which) {
		return function (evt) {
      
      evt.preventDefault()
      evt.stopPropagation()

			const { left , right  } = interval?.getBoundingClientRect() || { left: 0, right: 0 };
			const parentWidth = right - left;
			const p = Math.min(Math.max((evt.detail.x - left) / parentWidth, 0), 1);
      switch (which) {
        case 'day-start':
            dayStart = Math.min(p, breakStart - 0.1)
          break
        case 'day-end':
            dayEnd = Math.max(p, breakEnd + 0.1)
          break
        case 'break-start':
            breakStart = Math.min(p, breakEnd)
            breakStart = Math.max(breakStart, dayStart + 0.1)
          break
        case 'break-end':
            breakEnd = Math.max(p, breakStart)
            breakEnd = Math.min(breakEnd, dayEnd - 0.1)
      }
		}
	}
</script>

<div class="wrapper">
  <div bind:this={interval} class="intervals">
    <div class="dot"
      data-which="day-start"
      use:draggable
      on:dragmove="{setHandlePosition('day-start')}"
      style="left: {100 * dayStart}%"
    ></div>
    <div class="work-time"
      style="left: {100*dayStart}%; right: {100 - 100*breakStart}%"
    ></div>
    <div class="dot"
      data-which="break-start"
      use:draggable
      on:dragmove="{setHandlePosition('break-start')}"
      style="left: {100 * breakStart}%"
    ></div>
    <div class="dot"
      data-which="break-end"
      use:draggable
      on:dragmove="{setHandlePosition('break-end')}"
      style="left: {100 * breakEnd}%"
    ></div>
    <div class="work-time"
      style="left: {100*breakEnd}%; right: {100 - 100*dayEnd}%"
    ></div>
    <div class="dot"
      data-which="day-end"
      use:draggable
      on:dragmove="{setHandlePosition('day-end')}"
      style="left: {100 * dayEnd}%"
    ></div>
  </div>
</div>

<style>
  .wrapper {
    width: 100%;
		height: 20px;
		user-select: none;
		box-sizing: border-box;
		white-space: nowrap
  }

  .intervals {
		position: relative;
		width: 100%;
		height: 12px;
		top: 50%;
		transform: translate(0, -50%);
		background-color: var(--color-bg);
    border: 4px solid var(--color-text);
    border-radius: 5px;
    box-sizing: border-box;
  }

  .work-time {
    background-color: var(--color-text);
    top: 0;
    height: 6px;
    position: absolute;
  }

  .dot {
		position: absolute;
		top: 50%;
		width: 0;
		height: 0;
  }

  .dot:after {
    content: ' ';
		box-sizing: border-box;
		position: absolute;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		background-color: var(--color-text);
		transform: translate(-50%, -50%)
  }

</style>
