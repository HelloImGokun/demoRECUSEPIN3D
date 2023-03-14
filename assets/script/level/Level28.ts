import { _decorator, Component, Node, Vec2 } from 'cc';
import { LevelController } from '../controller/LevelController';
import { Configs } from '../../utils/Configs';
import { Pin } from '../P/Pin';
import { Pinmove } from '../P/Pinmove';
const { ccclass, property } = _decorator;

@ccclass('Level28')
export class Level28 extends LevelController {
  
    start() {
        //set up parent raycast callback       
        this.setUpRaycastCallback((rayData) => {
            for (let i = 0; i < rayData.length; i++) {
                this.rayToNode(rayData[i].collider.node)
            }
        }, (loc: Vec2) => {
            this.onMovePin(loc);
        })
    }
    private rayToNode(whichNode: Node) {
        if (whichNode.name.includes(Configs.PIN_NAME)) {
            //pull the pin
            whichNode.getComponent(Pin).onTouchMe();
        }
        if(whichNode.name.includes(Configs.PIN_MOVE)){
            this.currentMovePin = whichNode;
            console.log('set',this.currentMovePin)
        }

    }
    public onMovePin(loc: Vec2) {

        if (this.currentMovePin) {
            if (this.currentMovePin.name.includes(Configs.PIN_MOVE)) {
                //move pin
                this.currentMovePin.getComponent(Pinmove).onMoveMe(loc);
            }
        }

    }
}

