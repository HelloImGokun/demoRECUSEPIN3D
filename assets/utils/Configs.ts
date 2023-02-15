import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Configs')
export class Configs {
    //
    //public static 
    //string constant
    public static DOOR_NAME:string ='Door';
    public static PIN_NAME: string = 'pin';
    public static LOAD_LEVEL_PATH = 'level/lv';
    public static PLAYER_PREFAB_PATH = 'character/';
    public static SPIKE_PREFABS:string = 'Spike'
    public static ENEMY_NAME:string = 'enemy';
}


