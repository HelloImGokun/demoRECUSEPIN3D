import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Configs')
export class Configs {
    //
    //public static 
    //string constant
    public static DOOR_NAME:string ='Door';
    public static PIN_NAME: string = 'pin';
    public static PIN_MOVE:string = 'p_move';
    public static LOAD_LEVEL_PATH = 'level/lv';
    public static PLAYER_PREFAB_PATH = 'character/';
    public static SPIKE_PREFABS:string = 'Spike'
    public static KILL_HUNTER:string= 'hunter';
    public static KILL_SHOTER:string= 'shoter';
    public static KILL_ALL_OBJ:string = 'obj_kill_all';
    public static BOMB_ELECTRIC_FIRE:string = 'fire';
    public static FLOOR_GROUND_NAME:string = 'floor';
    public static PLAYER_NAME:string = 'player';
    public static FLOAT_PREFAB_PATH = 'items/';
    public static FLOAT_NAME:string = 'float';
    public static WATER_COLLIDER_NAME:string = 'Water'
    public static GAME_SCENES_PATH = 'game';
    public static KEY_STORAGE_LEVEL_PLAYER = 'levelPlayer';
    //water jump force
    public static WATER_JUMP_FORCE:number = 10;
}


