import { _decorator, Component, Node, Vec2 } from 'cc';
import { LevelController } from '../controller/LevelController';
import { Configs } from '../../utils/Configs';
import { Pin } from '../P/Pin';
import { Pinmove } from '../P/Pinmove';
const { ccclass, property } = _decorator;

@ccclass('Level26')
export class Level26 extends LevelController {
    start() {
        //set up parent raycast callback
        
        this.setUpRaycastCallback((rayData) => {
          for (let i = 0; i < rayData.length; i++) {
              this.rayToNode(rayData[i].collider.node)
          }
      })          
          }
          private rayToNode(whichNode: Node) {
              if (whichNode.name.includes(Configs.PIN_NAME)) {
                  //pull the pin
                  whichNode.getComponent(Pin).onTouchMe();
              }
              if(whichNode.name.includes('pin_move')){
                  //move pin
                  whichNode.getComponent(Pinmove).onMoveMe();
              }
          }
      }

