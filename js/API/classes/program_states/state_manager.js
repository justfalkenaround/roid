"use strict";

/*------STATE-MACHINE FOR THE PROGRAM------*/
class StateManager extends ObjectList {
    constructor(id = 'ANON-STATE-MANAGER') {
        super(id);
        this.currentState = null;
        this.previousState = null;
    }

    /*------UPDATE/RENDER/HANDLE-INPUT FOR ONLY THE CURRENT STATE------*/
    update() {
        if (this.currentState !== null) {
            this.currentState.update();
        }
    }

    render() {
        if (this.currentState !== null) {
            this.currentState.render();
        }
    }

    handleInput(e) {
        if (this.currentState !== null) {
            this.currentState.handleInput(e);
        }
    }

    /*------SWITCH TO ANOTHER STATE------*/
    switchTo(state) {
        this.previousState = this.currentState;
        this.currentState = state;
    }
}