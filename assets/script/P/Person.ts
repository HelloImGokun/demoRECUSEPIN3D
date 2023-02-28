import { _decorator, animation, Collider, Component, RigidBody, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Person')
export class Person extends Component {
    protected oldX: number = null;
    protected newX: number = null;
    protected oldZ: number = null;
    protected newZ: number = null;
    //
    @property(animation.AnimationController)
    protected animationController: animation.AnimationController;
    @property(RigidBody)
    protected rigidBody: RigidBody;
    protected isJumping: boolean = false;
    //trang thai co phao
    protected isFloat: boolean = false;
    //khai bao trong start
    @property(Collider)
    protected collider: Collider;
    //
    //
    protected start(): void {


    }
    protected update(dt: number) {

    }
    protected Move() {

    }
    protected Jump(force: Vec3) {
        this.rigidBody.applyForce(force);
    }
    protected Swim() {

    }
    protected Attack() {
        if (this.animationController)
        this.animationController.setValue('Attack', true);
    }
    protected Die() {

    }
    protected Win() {

    }
    protected Lose() {

    }

}


