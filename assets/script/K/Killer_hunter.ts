import { _decorator, Collider, Component, geometry, ICollisionEvent, Node, physics, PhysicsSystem, RigidBody, SkeletalAnimationComponent, tween, Vec3, Tween, ITriggerEvent } from 'cc';
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
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }
    private onTriggerEnter(event:ITriggerEvent){

        let otherNode: Node = event.otherCollider.node;
        let name = otherNode.name;

        if (name.includes(Configs.PLAYER_NAME)) {
            //attack
            if (this.isAttack) return;
            this.isAttack = true;
            this.Attack();
            console.log('attack');
            this.scheduleOnce(() => {
                //player
                if(!this.isDie)
                otherNode.getComponent(PlayerController).setDie();
            }, 0.3);
        } else if (name.includes(Configs.KILL_ALL_OBJ)) {
            //
            this.setDie();
            //

        }
    }
    public setDie() {
        //
        //kill all
        if(this.isDie) return;
        this.isDie = true;
        tween(this.node).stop();
        
        this.node.getComponent(RigidBody).isStatic = true;
        if (this.animationController)
            this.animationController.setValue('Die', true);
        // setTimeout(() => {

        // }, 700);
        //thay settimout = scheduleOnce
        this.scheduleOnce(() => {
            if (this.node)
                this.node.destroy();
        }, 0.5)
        //
    }
    //vision determine enemy
    isAttack: boolean = false;
    physicGroup: physics.PhysicsGroup = 1;
    createRay(direction: number) {
        if (this.isDie) return;
        //console.log('Tiger Direction',direction);
        const outRay = geometry.Ray.create(this.node.worldPosition.x, this.node.worldPosition.y , this.node.worldPosition.z, direction, 0, 0);
        if (PhysicsSystem.instance.raycastClosest(outRay, this.physicGroup, 3)) {
            let collider = PhysicsSystem.instance.raycastClosestResult.collider;
            let seeObjectName = collider.node.name;
            //console.log('Wild ray to',seeObjectName);
            if (seeObjectName != this.node.name) {
   
                
                if (seeObjectName.includes(Configs.PLAYER_NAME)) {
                    //move to player
                    // if (this.isAttack) {
                    //     return;
                    // }
                    // this.isAttack = true;

                    // console.log('...attack...')
                    // if (this.animationController)
                    //     this.animationController.setValue('Attack', true);
                    // //
                    // this.scheduleOnce(() => {
                    //     // gap character trc roi thuc thi attack
                    //     collider.node.getComponent(PlayerController).setDie();

                    // }, 0.5);
                    //
                    this.animationController.setValue('dx', 1);
                    let desination = collider.node.position;
                    //range to imply effect: dis from attacker to player
                    let range: number = 0;
                    let deltaX = this.newX - this.oldX
                    //trai or
                    if (desination.x <= this.node.position.x) {

                        //-90; rotate

                        tween(this.node).to(0.2, { eulerAngles: new Vec3(0, -90, 0) }).start();

                    } else {
                        // 90
                        tween(this.node).to(0.2, { eulerAngles: new Vec3(0, 90, 0) }).start();
                        // this.animationController.setValue('dx',Math.abs(deltaX));
                    }
                    let attackPos = new Vec3(desination.x + range, this.node.getPosition().y, desination.z);


                    tween(this.node).to(1, { position: attackPos }).start();
                    //reset
                    if (seeObjectName.includes(Configs.PLAYER_NAME) || seeObjectName.includes(Configs.KILL_HUNTER)||seeObjectName.includes(Configs.KILL_ALL_OBJ)) {
                        //game over
                    } else {
                        //restart

                    }
                    // setTimeout(() => {
                    //     this.isAttack = false;
                    // }, 1000);

                }
                if (seeObjectName.includes(Configs.PIN_NAME)||seeObjectName.includes(Configs.KILL_ALL_OBJ)) {

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
        //this.checkRun();
        if (this.isAttack) return;
        this.timeCount += deltaTime;
        if (this.timeCount > this.scanRating) {
            this.createRay(1);
            this.createRay(-1);
            this.timeCount = 0;
        }

    }
}
