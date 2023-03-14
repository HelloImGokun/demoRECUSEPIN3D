import { _decorator, Collider, Component, geometry, ITriggerEvent, Material, Node, physics, PhysicsSystem, RigidBody, SkeletalAnimationComponent, SkinnedMeshRenderer, tween, Vec3 } from 'cc';
import { Configs } from '../../utils/Configs';
import { PlayerController } from '../controller/PlayerController';
const { ccclass, property } = _decorator;

@ccclass('Killer_hunter')
export class Killer_hunter extends Component {
    animator: SkeletalAnimationComponent | null = null;
    @property(Node)
    private characterBody: Node | null = null;
    @property(Material)
    private firedMat: Material;
    //create a raycast
    LOG_NAME = null;
    isDie: boolean = false;
    start() {
        this.LOG_NAME = this.node.name;
        let collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        this.animator = this.node.getComponent(SkeletalAnimationComponent);
        this.animator.play('idle')
    }
    private onTriggerEnter(event: ITriggerEvent) {
        let otherNode: Node = event.otherCollider.node;
        let name = otherNode.name;
        console.log(name);
        if (name.includes(Configs.PLAYER_NAME)) {
            //attack
            if (this.isAttack) return;
            this.isAttack = true;
            this.scheduleOnce(() => {
                this.animator.play('attack');
                //
                if (otherNode && otherNode.active)
                    otherNode.getComponent(PlayerController).setDie();
                //
            }, 0.01);
        } else if (name.includes(Configs.KILL_ALL_OBJ)) {

            this.setDie();

        } else if (name.includes(Configs.BOMB_ELECTRIC_FIRE)) {
            //set mat
            if (this.characterBody && this.firedMat) {
                let skinMesh = this.characterBody.getComponent(SkinnedMeshRenderer);
                console.log('skin mesh', this.characterBody);
                skinMesh.setMaterial(this.firedMat, 0);
                skinMesh.setMaterial(this.firedMat, 1);
            }
            this.setDie();
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
            //console.log('Wild ray to', seeObjectName);//
            if (seeObjectName != this.node.name) {
                if (seeObjectName.includes(Configs.PLAYER_NAME)) {
                    //move to player                  
                    let desination = collider.node.position;
                    //range to imply effect: dis from attacker to player
                    let dis: number = 0.1;
                    if (desination.x <= this.node.position.x) {

                        tween(this.node).to(0.2, { eulerAngles: new Vec3(0, -90, 0) }).start();
                    }
                    else {
                        // 90
                        tween(this.node).to(0.2, { eulerAngles: new Vec3(0, 90, 0) }).start();
                        dis = -0.1;
                    }
                    let attackPos = new Vec3(desination.x + dis, this.node.getPosition().y, desination.z);
                    //
                    //run
                    this.scheduleOnce(() => {
                        this.animator.play('run');
                    }, 0.01);
                    tween(this.node).to(0.6, { position: attackPos }).start();
                }
                if (seeObjectName.includes('pin')) {

                    return;
                }
            }
        } else {

        }

    }
    setDie() {
        this.isDie = true;
        if (this.animator)
            this.scheduleOnce(() => {
                this.animator.play('die');
            }, 0.01)
        setTimeout(() => {
            if (this.node)
                this.node.destroy();
        }, 700);

    }
    timeCount: number = 0;
    //scan rating and action, scan every time unit
    scanRating: number = 1;
    update(deltaTime: number) {
        // [4]
        if (this.isAttack) return;
        this.timeCount += deltaTime;
        if (this.timeCount > this.scanRating) {
            this.createRay(1);
            this.createRay(-1);
            this.timeCount = 0;
        }
    }
}


