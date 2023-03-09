import { _decorator, CCBoolean, CCFloat, CCInteger, Component, Enum, Node, Vec3 } from 'cc';
import { PointType } from '../Enum/PointType';
import { Float } from '../F/Float';
const { ccclass, property } = _decorator;

@ccclass('PointNode')
export class PointNode extends Component {
    @property({type:CCBoolean})
    private isLock:boolean;

    @property({type:Enum(PointType)})
    private pointType:PointType;
    @property(CCFloat)
    private movingTime:number = 0;

    @property(CCFloat)
    private delayTime:number = 0;

    @property(Vec3)
    private jumpForce:Vec3 | null  = null
    @property(Vec3)
    private moveRotation:Vec3 | null = null;
    //@property()
    //animation

    getPointType(){
        return this.pointType
    }
    getIsLock(){
        return this.isLock;
    }
    setUnlock(){
        this.isLock = false;
    }
    setLockPoint(){
        this.isLock = true;
    }
    getPosition(){
        return this.node.position;
    }
    getJumpForce(){
        return this.jumpForce!=null?this.jumpForce:new Vec3(0,0,0);
    }
    getMovingTime(){
        return this.movingTime;
    }
    getDelayTime(){
        return this.delayTime;
    }
    getDirection(){
        return this.moveRotation;
    }
}


