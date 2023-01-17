const PLAYER_ACTIONS = {
    IDLE: 0,
    ATTACK: 1
};


class Player {
    constructor(id) {
        this.id = id;
        this.select = -1;
        this.action = PLAYER_ACTIONS.IDLE;
    }


    setAction(action) {
        this.action = action;
    }

    invalidateSelect() {
        this.select = -1;
    }

    handleInput(keyCode) {
        //player 1 controls
        if (this.id === 1) {
            switch (keyCode) {
                //1-9 keys used to select fortress
                case 49:
                case 50:
                case 51:
                case 52:
                case 53:
                case 54:
                case 55:
                case 56:
                case 57:
                    //if attack action, input determines target
                    if (this.action === PLAYER_ACTIONS.ATTACK) {
                        let target = keyCode - 49;
                        fortresses[this.select].attack(fortresses[target]);
                        console.log('Player 1 attack on fortress ' + target);
                        this.action = PLAYER_ACTIONS.IDLE;
                    }
                    //if idle action, input determines select
                    else if (this.action === PLAYER_ACTIONS.IDLE) {
                        let select = keyCode - 49;
                        //if selected fortress exists and you are the owner
                        if (fortresses[select] && fortresses[select].owner === this.id) {
                            //remove previous highlight
                            if (fortresses[this.select]) fortresses[this.select].setHighlight(false);
                            this.select = select;
                            fortresses[select].setHighlight(true);
                            console.log('Player 1 selected fortress ' + select);
                        }
                    }
                    break;
                    //q for attack call
                case 81:
                    if (this.select !== -1) {
                        console.log('Player 1 attack call');
                        this.action = PLAYER_ACTIONS.ATTACK;
                    }
                    break;
                    //w for retreat call
                case 87:
                    if (this.select !== -1) {
                        console.log('Player 1 retreat call');
                        fortresses[this.select].retreat();
                    }
                    break;
                    //e for wander call
                case 69:
                    if (this.select !== -1) {
                        console.log('Player 1 wander call');
                        fortresses[this.select].wander();
                    }
                    break;
            }
        }
        //player2 controls
        else if (this.id === 2) {
            switch (keyCode) {
                //num1-9 keys used to select fortress
                case 97:
                case 98:
                case 99:
                case 100:
                case 101:
                case 102:
                case 103:
                case 104:
                case 105:
                    //if attack action, input determines target
                    if (this.action === PLAYER_ACTIONS.ATTACK) {
                        let target = keyCode - 97;
                        fortresses[this.select].attack(fortresses[target]);
                        console.log('Player 2 attack on fortress ' + target);
                        this.action = PLAYER_ACTIONS.IDLE;
                    }
                    //if idle action, input determines select
                    else if (this.action === PLAYER_ACTIONS.IDLE) {
                        let select = keyCode - 97;
                        //if selected fortress exists and you are the owner
                        if (fortresses[select] && fortresses[select].owner === this.id) {
                            //remove previous highlight
                            if (fortresses[this.select]) fortresses[this.select].setHighlight(false);
                            this.select = select;
                            fortresses[select].setHighlight(true);
                            console.log('Player 2 selected fortress ' + select);
                        }
                    }
                    break;
                    //num0 for attack call
                case 96:
                    if (this.select !== -1) {
                        console.log('Player 2 attack call');
                        this.action = PLAYER_ACTIONS.ATTACK;
                    }
                    break;
                    //num. for retreat call
                case 110:
                    if (this.select !== -1) {
                        console.log('Player 2 retreat call');
                        fortresses[this.select].retreat();
                    }
                    break;
                    //numEnter for wander call
                case 13:
                    if (this.select !== -1) {
                        console.log('Player 2 wander call');
                        fortresses[this.select].wander();
                    }
                    break;
            }

        }
    }
}