import { _decorator, Collider, Component, geometry, ICollisionEvent, Node, physics, PhysicsSystem, RigidBody, SkeletalAnimationComponent, tween, Vec3 } from 'cc';
import { Configs } from '../../utils/Configs';
import { Person } from '../P/Person';
import { PlayerController } from '../PlayerController';
const { ccclass } = _decorator;

@ccclass('Killer_hunter')
export class Killer_hunter extends Person {

    //create raycast
    LOG_NAME = null;
    //
    isDie: boolean = false;
    start() {
        this.LOG_NAME = this.node.name;
        let collider = this.getComponent(Collider)
        collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }
    private onCollisionEnter(event: ICollisionEvent) {
        let name = event.otherCollider.node.name;
        if (name.includes(Configs.PLAYER_NAME) || name.includes(Configs.KILL_PLAYER_OBJ)) {
            //attack
            if (this.animationController)
                this.animationController.setValue('Attack', true);
        } else if (name.includes(Configs.KILL_ALL_OBJ)) {
            //kill all
            this.isDie = true;
            this.node.getComponent(RigidBody).isStatic = true;
            if (this.animationController)
                this.animationController.setValue('Die', true);
            setTimeout(() => {
                if (this.node)
                    this.node.destroy();
            }, 500);

        }
    }

    //vision determine enemy
    isAttack: boolean = false;
    physicGroup: physics.PhysicsGroup = 1;
    createRay(direction: number) {
        if (this.isDie) return;
        //console.log('Tiger Direction',direction);
        const outRay = geometry.Ray.create(this.node.worldPosition.x, this.node.worldPosition.y + 0.1, this.node.worldPosition.z, direction, 0, 0);
        if (PhysicsSystem.instance.raycastClosest(outRay, this.physicGroup, 3)) {
            let collider = PhysicsSystem.instance.raycastClosestResult.collider;
            let seeObjectName = collider.node.name;
            //console.log('Wild ray to',seeObjectName);
            if (seeObjectName != this.node.name) {
                if (seeObjectName.includes(Configs.PLAYER_NAME)) {
                    //move to player
                    if (this.isAttack) {
                        return;
                    }
                    this.isAttack = true;

                    console.log('...attack...')
                    if (this.animationController)
                        this.animationController.setValue('Attack', true);
                    //
                    this.scheduleOnce(() => {
                        // gap character trc roi thuc thi attack
                        collider.node.getComponent(PlayerController).setDie();

                    }, 0.5);
                    //
                    let desination = collider.node.position;
                    //range to imply effect: dis from attacker to player
                    let range: number = 0;
                    let deltaX = this.newX - this.oldX
                    if (desination.x > this.node.position.x) {
                        if (this.node.eulerAngles.y < -80) {
                            //-90; rotate
                            tween(this.node).by(0.2, { eulerAngles: new Vec3(0, -270, 0) }).start();

                        } else {
                            //do nothing

                        }

                        range = -0.7;
                    } else {
                        if (this.node.eulerAngles.y < -80) {
                            //-90 rotate
                            //do nothing
                        } else {
                            tween(this.node).by(0.2, { eulerAngles: new Vec3(0, 270, 0) }).start();

                        }

                        // this.animationController.setValue('dx',Math.abs(deltaX));
                    }
                    let attackPos = new Vec3(desination.x + range, desination.y, desination.z);


                    tween(this.node).to(1, { position: attackPos }).start();
                    //reset
                    if (seeObjectName.includes(Configs.PLAYER_NAME) || seeObjectName.includes(Configs.KILL_PLAYER_OBJ)) {
                        //game over
                    } else {
                        //restart

                    }
                    // setTimeout(() => {
                    //     this.isAttack = false;
                    // }, 1000);

                }
                if (seeObjectName.includes(Configs.PIN_NAME)) {

                    return;
                }
            }
        } else {
        }

    }
    timeCount: number = 0;
    //scan rating and action, scan every time unit
    scanRating: number = 1;
    //update 
    update(deltaTime: number) {
        // [4]  

        if (this.isAttack) return;
        this.timeCount += deltaTime;
        if (this.timeCount > this.scanRating) {
            this.createRay(1);
            this.createRay(-1);
            this.timeCount = 0;
        }
        this.checkRun();
    }
    private checkMoveLeftOrRight(deltaX) {
        
        if (deltaX > 0.001) {
            //move right
            this.node.setRotationFromEuler(new Vec3(0, 90, 0));
        } else if (deltaX < -0.001) {
            //move left
            this.node.setRotationFromEuler(new Vec3(0, -90, 0));
        }
    }

    private checkRun() {
        if (this.oldX == null) {
            this.oldX = this.node.position.x;
        } else {
            this.newX = this.node.position.x;
            let deltaX = this.newX - this.oldX
            //check left or right
            this.checkMoveLeftOrRight(deltaX);
            this.animationController.setValue('dx', Math.abs(deltaX));
            //console.log('dx',deltaX);
            this.oldX = this.newX;
            console.log('deltaX', deltaX);
        }
    }

}
