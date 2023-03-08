import { _decorator, animation, Collider, Component, RigidBody, Vec3, Node, tween, SkeletalAnimationComponent, CCBoolean } from 'cc';
import { PointNode } from './PointNode';
const { ccclass, property } = _decorator;
const enum AnimationState {
    Idle = 'idle',
    Run = 'run',
    Jump = 'midair',
    swim = 'swim',
    Dead = 'die',
    Victory = 'victory'
}
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

    @property({ type: Node })
    protected neckNode: Node;
    //
    protected currentAnimationState = AnimationState.Idle;
    //
    protected start(): void {
        this.animator = this.node.getComponent(SkeletalAnimationComponent);

    }
    protected update(dt: number) {

    }
    protected Move(pointNode: PointNode, desinationPoint: Vec3, finishCallback) {
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
        console.log('swim');
        if (this.currentAnimationState != AnimationState.swim) {
            this.animator.play(AnimationState.swim);
            this.currentAnimationState = AnimationState.swim;
        }
    }
    protected playAttack() {
        if (this.isOver) return;
        if (this.currentAnimationState != AnimationState.Attack) {
            this.animator.play(AnimationState.Attack);
            this.currentAnimationState = AnimationState.Attack;
        }
    }
    protected climb(point: PointNode, finishCallback) {
        this.playJump();

        this.scheduleOnce(() => {
            this.isJumping = true;
            this.rigidBody.clearState();
            //tween(this.node).to(0.2,{position:point.node.getPosition()}).start();
            this.rigidBody.applyForce(point.getJumpForce());
        }, point.getMovingTime());
        this.scheduleOnce(() => {
            this.isJumping = false;
            finishCallback();
        }, point.getDelayTime());
    }
    protected Die() {

    }
    protected Win() {

    }
    protected Lose() {

    }
    //
    protected playJump() {
        if (this.currentAnimationState != AnimationState.Jump) {
            console.log('play jump');
            this.animator.play(AnimationState.Jump);
            this.currentAnimationState = AnimationState.Jump;
        }
    }
    protected playIdle() {
    
        if (this.currentAnimationState != AnimationState.Idle) {
            this.animator.play(AnimationState.Idle);
            this.currentAnimationState = AnimationState.Idle;
        }
    }

    protected playRun() {
        //neu dang run roi thi thoi
        if (this.currentAnimationState != AnimationState.Run &&this.currentAnimationState != AnimationState.Jump) {
            console.log('playRun');
            this.animator.play(AnimationState.Run);
            this.currentAnimationState = AnimationState.Run;
        }
    }
    protected playSwim() {

    }
    protected playDie() {
        if (this.currentAnimationState != AnimationState.Dead) {
            this.animator.play(AnimationState.Dead);
            this.currentAnimationState = AnimationState.Dead;
        }
    }
    protected playVictory() {
        this.animator.play(AnimationState.Victory);
    }
    //


}


