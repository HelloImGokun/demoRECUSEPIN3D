import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pinmove')
export class Pinmove extends Component {
    @property(Vec2)
    moveDirection:Vec2 | null = null;
    @property
    maxPos:number = 0;
    @property
    minPos:number = 0;
    start(){
        //move by x
    }
    onMoveMe(delta:Vec2){
        //move up/dow or left/right with fixed direction

        let currentPos = this.node.getWorldPosition();
        //add delta
        let constrainDelta = new Vec3(this.moveDirection.x*delta.x,this.moveDirection.y*delta.y,0)
        //move by y
        let newPos = currentPos.add(constrainDelta);
        if(this.moveDirection.y!=0){
            if(newPos.y>this.maxPos ||newPos.y<this.minPos){
                return;
            }
        }
        //move by x
        if(this.moveDirection.x!=0){
            if(newPos.x>this.maxPos ||newPos.x<this.minPos){
                return;
            }
        }
        this.node.setWorldPosition(newPos);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}


