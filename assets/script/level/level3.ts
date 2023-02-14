import { _decorator, Component, Node } from 'cc';
import { Configs } from '../../utils/Configs';
import { LevelController } from '../controller/LevelController';
const { ccclass, property } = _decorator;

@ccclass('level3')
export class level3 extends LevelController {
    @property(Node)
    private pin:Node | [] = [];
    start() {
        //set up parent raycast
        this.setUpRaycastCallback((rayData)=>{
            console.log(this.name,rayData);
            for(let i = 0; i < rayData.length;i++){
                console.log('ray',rayData[i].collider.node.name);
                this.rayToNode(rayData[i].collider.node)
            }
        })
    
    }
    //===============LEVEL LOGIC HERE!========================///
    private rayToNode(whichNode:Node){
        if(whichNode.name.includes(Configs.PIN_NAME)){
            this.doWin();
        }
    }
    //===============LEVEL LOGIC HERE!========================///
    private doWin(){
        this.node.destroy();
    }

}


