export default class ZepConfig {
    public readonly ZEP_API_URL: string = 'https://api.zep.com';
    public readonly ZEP_API_KEY: string = 'your-zep-api-key';
    constructor() {
        console.log('ZepConfig initialized');
    }
}