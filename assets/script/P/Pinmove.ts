import { _decorator, Component, Node, Vec2, Vec3, tween } from 'cc';
import { PointNode } from './PointNode';
const { ccclass, property } = _decorator;

@ccclass('Pinmove')
export class Pinmove extends Component {
    @property(Vec2)
    moveDirection: Vec2 | null = null;
    @property
    maxPos: number = 0;
    @property
    minPos: number = 0;
    @property(Node)
    private attachPathNode: Node;


    @property(Vec2)
    private pinDirection: Vec2 | null = null;
    callbackToLevel;

    setUpCallback(callbackToLevel) {
        this.callbackToLevel = callbackToLevel;
    }
    start() {
        //move by x
    }
    onTouchMe() {

    }
    onMoveMe(delta: Vec2) {
        //move up/dow or left/right with fixed direction

        let currentPos = this.node.getWorldPosition();
        //add delta
        let constrainDelta = new Vec3(this.moveDirection.x * delta.x, this.moveDirection.y * delta.y, 0)
        //move by y
        let newPos = currentPos.add(constrainDelta);
        if (this.moveDirection.y != 0) {
            if (newPos.y > this.maxPos) {
                //khi keo pin vuot qua diem min max
                if (this.pinDirection.y == 1) {
                    //unlock
                    this.unlockPoint();
                }
                return;
            }
            if (newPos.y < this.minPos) {
                //khi keo pin vuot qua diem min max
                if (this.pinDirection.y == -1) {
                    //unlock
                    this.unlockPoint();
                }
                return;
            }
        }
        //move by x
        if (this.moveDirection.x != 0) {
            if (newPos.x > this.maxPos) {
                if (this.pinDirection.x == 1) {
                    //unlock
                    this.unlockPoint();
                }
                return;
            }
            if (newPos.x < this.minPos) {
                if (this.pinDirection.x == -1) {
                    //unlock
                    this.unlockPoint();
                }
                return;
            }
        }

        this.node.setWorldPosition(newPos);
        // tween(this.node).to(0.01,{position:newPos}).start();
    }
    private unlockPoint() {
        if (this.attachPathNode != undefined) {
            this.attachPathNode.getComponent(PointNode).setUnlock();
            //thong bao cho level mo pin => player check path
            this.callbackToLevel();
        }
    }
}


