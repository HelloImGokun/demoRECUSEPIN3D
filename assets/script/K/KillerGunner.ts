import { _decorator, Component, Node, SkeletalAnimationComponent, Prefab, Vec3, Collider, ITriggerEvent, physics, geometry, PhysicsSystem, instantiate, Material, SkinnedMeshRenderer } from 'cc';
import { Configs } from '../../utils/Configs';
import { BulletGunner } from '../B/BulletGunner';
import { PlayerController } from '../controller/PlayerController';
const { ccclass, property } = _decorator;

@ccclass('KillerGunner')
export class KillerGunner extends Component {
    @property(SkeletalAnimationComponent)
    private animator: SkeletalAnimationComponent | null = null;
    @property(Prefab)
    private bulletPrefab:Prefab | null = null;
    @property(Vec3)
    private direction: Vec3 | null = new Vec3(0,0,0);
    //create a raycast
    private LOG_NAME = null;
    private isDie: boolean = false;
    private gunPos:Vec3  = new Vec3(0,0.5,0.5);


    @property(Node)
    private characterBody: Node | null = null;

    @property(Material)
    private firedMat:Material;
    start() {
        this.LOG_NAME = this.node.name;
        let collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        //this.animator = this.node.getComponent(SkeletalAnimationComponent);
        this.animator.play('aim')

    }
    private onTriggerEnter(event: ITriggerEvent) {
        let otherNode: Node = event.otherCollider.node;
        let name = otherNode.name;
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
            },0.01);
            // this.scheduleOnce(() => {
            //     this.isAttack = false;
            //     //player

            // }, 2)
   

        } else if (name.includes(Configs.KILL_ALL_OBJ)) {
           
            this.setDie();

        }else if(name.includes(Configs.BOMB_ELECTRIC_FIRE)){
              //set mat
              if (this.characterBody && this.firedMat) {
                let skinMesh = this.characterBody.getComponent(SkinnedMeshRenderer);
                console.log('skin mesh',this.characterBody);
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
                    console.log('fire...');    
                    this.fire();     
                }
                if (seeObjectName.includes('pin')) {

                    return;
                }
            }
        } else {

        }

    }
    fire(){
        if (this.bulletPrefab) {
            let bulletfire = instantiate(this.bulletPrefab);
            bulletfire.setPosition(this.gunPos);
            bulletfire.getComponent(BulletGunner).setUp(this.direction);
            this.node.addChild(bulletfire);
        }
    }
    setDie(){
        console.log('die....')
        this.isDie = true;
        // this.node.getComponent(RigidBody).isStatic = true;
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
    scanRating: number = 0.1;
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

