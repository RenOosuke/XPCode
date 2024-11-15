<script>
    export let handleResizing;
    export let onDragStart = undefined;
    export let onDragEnd = undefined;
    export let borders = {}
    let {
        top = false,
        left = false,
        right = false,
        bottom = false
    } = borders;

    let isVertical = false;

    let mouseIsDown = false;
    let direction = '';

    let oldCoords = {
        x: undefined,
        y: undefined
    }

    const handleMouseUp = (ev) => {
        document.removeEventListener('mousemove', mouseMoveTracker);
        document.removeEventListener('mouseup', handleMouseUp);
        mouseIsDown = false;
        direction = '';
        document.body.removeAttribute("id")
        document.body.removeAttribute("class")
        document.body.style.removeProperty('cursor');

        if(onDragEnd) {
            onDragEnd();
        }
    }

    const mouseMoveTracker = (ev) => {
        if(isVertical) {
            let distanceY = ev.y - oldCoords.y;
            oldCoords.y = ev.y
            handleResizing(distanceY, direction)
        } else {
            let distanceX = ev.x - oldCoords.x;
            oldCoords.x = ev.x;
            handleResizing(distanceX, direction)
        }
    }

    const handleMouseDown = (ev, _direction) => {
        if(onDragStart) {
            onDragStart();
        }

        switch(_direction) {
            case 'top':
            case 'bottom':
                isVertical = true;
                document.body.style.cursor = 'ns-resize';
                break
            case 'left':
            case 'right':
                isVertical = false;
                document.body.style.cursor = 'ew-resize';
                break;
        }

        mouseIsDown = true;
        direction = _direction;
        oldCoords.x = ev.x;
        oldCoords.y = ev.y;
        document.addEventListener('mousemove', mouseMoveTracker);
        document.addEventListener('mouseup', handleMouseUp)
        document.body.setAttribute("id", "unselectable");
        document.body.setAttribute("class", "dragging");
    }
</script>

{#if top}
    <div class="top-border resize-border dragging-{mouseIsDown}" on:mousedown={(ev) => handleMouseDown(ev, 'top')}>

    </div>
{/if}

{#if left}
    <div class="left-border resize-border dragging-{mouseIsDown}" on:mousedown={(ev) => handleMouseDown(ev, 'left')}>

    </div>
{/if}

{#if right}
    <div class="right-border resize-border dragging-{mouseIsDown}" on:mousedown={(ev) => handleMouseDown(ev, 'right')}>

    </div>
{/if}

{#if bottom}
    <div class="bottom-border resize-border dragging-{mouseIsDown}" on:mousedown={(ev) => handleMouseDown(ev, 'bottom')}>

    </div>
{/if}

<style>
    .left-border, .right-border {
        width: .2rem;
        height: 100%;
    }
    
    .dragging-false.left-border:hover, .dragging-false.right-border:hover {
        cursor: ew-resize;
    }

    .dragging-false.top-border:hover, .dragging-false.bottom-border:hover {
        cursor: ns-resize;
    }

    .top-border, .bottom-border {
        height: .2rem;
        width: 100%;
    }

    .right-border {
        right: 0;
        top: 0;
    }

    .top-border {
        top: 0;
        left: 0;
    }

    .left-border {
        left: 0;
        top: 0;
    }

    .bottom-border {
        left: 0;
        bottom: 0;
    }

    .resize-border {
        position: absolute;
        transition-behavior: normal;
        transition-delay: 0.15s;
        transition-duration: 0.15s;
        transition-property: background-color;
        transition-timing-function: ease-out;
    }
    
    .resize-border:hover {
        background-color: var(--outline-color);
    }

</style>