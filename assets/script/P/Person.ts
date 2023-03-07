import { _decorator, animation, Collider, Component, RigidBody, Vec3, Node, tween, SkeletalAnimationComponent } from 'cc';
import { PointNode } from './PointNode';
const { ccclass, property } = _decorator;

@ccclass('Person')
export class Person extends Component {
    protected oldX: number = null;
    protected newX: number = null;
    protected oldZ: number = null;
    protected newZ: number = null;
    //
    animator: SkeletalAnimationComponent | null = null;
    //

    @property(RigidBody)
    protected rigidBody: RigidBody;
    protected isJumping: boolean = false;
    //trang thai co phao
    protected isFloat: boolean = false;
    //khai bao trong start
    @property(Collider)
    protected collider: Collider;

    @property({type:Node})
    protected neckNode:Node;
    //
    //
    protected start(): void {


    }
    protected update(dt: number) {

    }
    protected Move(pointNode:PointNode,desinationPoint:Vec3,finishCallback) {
        tween(this.node).sequence(
            tween(this.node).to(pointNode.getMovingTime(), { position: desinationPoint }),
            tween(this.node).delay(pointNode.getDelayTime()),
            tween(this.node).call(finishCallback)
        ).start();
    }
    protected Jump(force: Vec3) {
        this.rigidBody.applyForce(force);
    }
    protected Swim() {

    }
    protected Attack() {
        if (this.animator)
        this.animator.play('attack');
    }
    protected climb(point:PointNode,finishCallback) {
        this.animator.play('midair');
     
        this.scheduleOnce(() => {
            this.isJumping=true;
            this.rigidBody.clearState();
            //tween(this.node).to(0.2,{position:point.node.getPosition()}).start();
            this.rigidBody.applyForce(point.getJumpForce());
        }, point.getMovingTime());
        this.scheduleOnce(() => {
            this.isJumping=false;
            finishCallback();
        }, point.getDelayTime());
    }
    protected Die() {

    }
    protected Win() {

    }
    protected Lose() {

    }

}


