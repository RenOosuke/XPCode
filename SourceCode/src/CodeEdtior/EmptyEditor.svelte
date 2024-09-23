<script>
  import { onMount } from "svelte";

    // TEMP_HARDCODE
    const backgroundColor = 'var(--primary-light-bg)';
    const color = '#cccccc';
    const borderColor = '#2b2b2b';
    
    const instructions = [
        {label: 'Show All Commands', button: ['Ctrl', 'Shift', 'P']},
        {label: 'Go to File', button: ['Ctrl', 'P']},
        {label: 'Find in Files', button: ['Ctrl','Shift', 'F']},
        {label: 'Start Debugging', button: ['F5']},
        {label: 'Toggle Terminal', button: ['Ctrl', '`']},
    ]
    // console.log(XPCodeDir);
    let vscodeIconPath = path.join(paths.icons, 'default', 'vscode.png');
    onMount(() => {
    })
</script>


<div class="empty_editor_window" style="background: {backgroundColor}; color: {color}; border-color: {borderColor};">
    <div class="centered">
        <!-- <div class="logo">

        </div> -->
        <img src='{vscodeIconPath}' href='' class="logo"/>

        <div class="instructions">
            {#each instructions as instruction}
                <div class="single-instruction">
                    <div class="label">
                        {instruction.label}
                    </div>

                    <div class="command">
                        {#each instruction.button as button, i}
                            <div class="command-button">
                                {button}
                            </div>

                            {#if i < instruction.button.length-1}
                                <p class="additional">{'+'}</p>
                            {/if}
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>


<style>
    .empty_editor_window {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .centered {
        display: flex;
        flex-direction: column;
        width: fit-content;
        margin-left: auto;
        margin-right: auto;
    }

    .logo {
       -webkit-filter: grayscale(100%) contrast(0%) brightness(17%) !important;
       max-width: 18rem;
       margin-bottom: 1rem;
    }

    .command {
        display: flex;
        color: #a9a9a9; 
    }

    .command-button {
        padding: 0 0.3rem;
        background-color: #2d2d2d;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 1.5rem;
        border-radius: .2rem;
        font-size: .7rem;
        /* box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px; */
        box-shadow: #363636 0 -3px 4px 0px inset, #1e1e1e 0 -4px 0px 1px inset;
    }

    .single-instruction {
        display: flex;
        margin-bottom: 1rem;
    }

    .label {
        width: 10rem;
        color: #888888;
        font-size: .85rem;
    }

    p {
        margin: 0rem 0.2rem;
    }

    .instructions {
        display: flex;
        flex-direction: column;
    }

    /* .logo {
        background-image: url('');
    } */
</style>