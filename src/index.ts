import { webhookService } from './webhook/webhookService';
import messageConfig from './message/interfaces/messageConfig';
import webhookConfig from './webhook/interfaces/webhookConfig';
import { getMessageProvider } from './message/management/getMessageProvider';

// Main function to initialize the webhook service
async function startWebhookService() {
  const isWebhookEnabled = messageConfig.get('MESSAGE_WEBHOOK_ENABLED');
  if (isWebhookEnabled) {
    console.log('Webhook service is enabled, starting...');

    const messageService = getMessageProvider();
    const channelId = messageConfig.get('MESSAGE_DEFAULT_CHANNEL_ID');
    const webhookPort = webhookConfig.get('WEBHOOK_PORT');

    await webhookService.start(messageService, channelId.toString(), webhookPort.toString());
  } else {
    console.log('Webhook service is disabled.');
  }
}

// Execute the main function
startWebhookService();
