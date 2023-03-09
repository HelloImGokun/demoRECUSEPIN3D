import { _decorator, animation, Collider, Component, RigidBody, Vec3, Node, tween, SkeletalAnimationComponent, CCBoolean } from 'cc';
import { PointNode } from './PointNode';
const { ccclass, property } = _decorator;
const enum AnimationState {
    Idle = 'idle',
    Run = 'run',
    Jump = 'midair',
    Swim = 'swim',
    Die = 'die',
    Victory = 'victory',
    Attack = 'attack',
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
    protected isOver: boolean = false;
    //
    Exittime: boolean = false;
    TimetooutAnim: number = 0;
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
        this.currentAnimationState = null;

    }
    protected update(dt: number) {

    }
    protected Move(pointNode: PointNode, desinationPoint: Vec3, finishCallback) {
        tween(this.node).sequence(
            tween(this.node).to(pointNode.getMovingTime(), { position: desinationPoint }),
            tween(this.node).delay(pointNode.getDelayTime()),
            //tween(this.node).call(finishCallback)
        ).start();
        this.scheduleOnce(()=>{
            finishCallback();
        },pointNode.getDelayTime())
    }
    protected Jump(force: Vec3) {
        this.rigidBody.applyForce(force);
    }
    protected Swim() {

    }
    protected playAttack() {
        if (this.isOver) return;
        if (this.currentAnimationState != AnimationState.Attack) {
            this.animator.play(AnimationState.Attack);
            this.currentAnimationState = AnimationState.Attack;
        }
    }
    protected climb(point: PointNode, finishCallback) {
       // this.playJump();

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
    // protected playJump() {
    //     if (this.isOver) return;
    //     if (this.currentAnimationState != AnimationState.Jump) {
    //         console.log('play jump');
    //         this.animator.play(AnimationState.Jump);
    //         this.currentAnimationState = AnimationState.Jump;
    //     }
    // }
    // protected playIdle() {
    //     if (this.isOver) return;
    //     if (this.currentAnimationState != AnimationState.Idle) {
    //         console.log('play idle');
    //         this.animator.play(AnimationState.Idle);
    //         this.currentAnimationState = AnimationState.Idle;
    //     }
    // }

    // protected playRun() {
    //     //neu dang run roi thi thoi
    //     if (this.currentAnimationState != AnimationState.Run && this.notJump() && this.notSwim() && this.notDie()) {
    //         console.log('playRun');
    //         this.animator.play(AnimationState.Run);
    //         this.currentAnimationState = AnimationState.Run;
    //     }
    // }
    // protected playSwim() {
    //     if (this.isOver) return;
    //     if (this.currentAnimationState != AnimationState.Swim) {
    //         console.log('swim');
    //         this.animator.play(AnimationState.Swim);
    //         this.currentAnimationState = AnimationState.Swim;
    //     }
    // }
    // protected playDie() {
    //     if (this.currentAnimationState != AnimationState.Die) {
    //         this.animator.play(AnimationState.Die);
    //         this.currentAnimationState = AnimationState.Die;
    //     }
    // }
    // protected playVictory() {
    //     this.animator.play(AnimationState.Victory);
    // }
    protected notJump() {
        return this.currentAnimationState != AnimationState.Jump;
    }
    protected notSwim() {
        return this.currentAnimationState != AnimationState.Swim
    }
    protected notDie() {
        return this.currentAnimationState != AnimationState.Die
    }
    //


}


