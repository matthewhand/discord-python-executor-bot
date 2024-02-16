// src/managers/messageResponseManager.js
const configurationManager = require('../config/configurationManager');
const logger = require('../utils/logger');
const messageResponseUtils = require('../utils/messageResponseUtils');
const constants = require('../config/constants'); // Ensure this import is correct

class MessageResponseManager {
    constructor() {
        logger.debug('Initializing MessageResponseManager with default configuration.');
        this.config = configurationManager.getConfig('messageResponse') || this.defaultConfig();
        this.setupConfig();
        logger.debug(`MessageResponseManager configuration: ${JSON.stringify(this.config)}`);
    }

    defaultConfig() {
        logger.debug('Loading default configuration for MessageResponseManager.');
        return {
            interrobangBonus: 0.2,
            mentionBonus: 0.4,
            botResponsePenalty: 0.6,
            timeVsResponseChance: [[12345, 0.4], [420000, 0.6], [4140000, 0.2]],
            llmWakewords: [],
            unsolicitedChannelCap: 5,
        };
    }

    setupConfig() {
        logger.debug('Setting up configuration for MessageResponseManager.');
        this.interrobangBonus = this.config.interrobangBonus;
        this.mentionBonus = this.config.mentionBonus;
        this.botResponsePenalty = this.config.botResponsePenalty;
        this.timeVsResponseChance = this.config.timeVsResponseChance;
        this.llmWakewords = this.config.llmWakewords;
        this.unsolicitedChannelCap = this.config.unsolicitedChannelCap;
    }

    shouldReplyToMessage(message) {
        if (!message || !message.channel || !message.channel.id) {
            logger.error('Invalid message object passed to shouldReplyToMessage.');
            return { shouldReply: false, responseChance: 0 };
        }

        let baseChance = this.calcBaseChanceOfUnsolicitedReply(message.channel.id);
        logger.debug(`Base chance of reply before bonuses: ${baseChance}`);

        baseChance += this.calculateBonusForMessageContent(message);
        logger.debug(`Base chance of reply after content bonus: ${baseChance}`);

        if (message.mentions.users.has(constants.CLIENT_ID)) {
            baseChance += this.mentionBonus;
            logger.debug(`Increased chance of reply due to direct mention: ${baseChance}`);
        }

        if (message.author.bot) {
            baseChance = Math.max(0, baseChance - this.botResponsePenalty);
            logger.debug(`Adjusted chance of reply due to author being a bot: ${baseChance}`);
        }

        const shouldReply = Math.random() < baseChance;
        logger.debug(`Decision to reply: ${shouldReply} (chance: ${baseChance})`);

        const responseChance = shouldReply ? 1 : baseChance; // Ensure a full chance for direct replies
        return {
            shouldReply,
            responseChance,
        };
    }

    calcBaseChanceOfUnsolicitedReply(channelId) {
        const timeSinceLastReply = messageResponseUtils.getTimeSinceLastReply(channelId);
        logger.debug(`Time since last reply for channel ${channelId}: ${timeSinceLastReply}`);
        
        for (let [duration, chance] of this.timeVsResponseChance) {
            if (timeSinceLastReply <= duration) {
                logger.debug(`Base chance of reply based on time since last reply: ${chance}`);
                return chance;
            }
        }
        logger.debug('No base chance of reply based on time thresholds; returning 0.');
        return 0;
    }

    calculateBonusForMessageContent(message) {
        let bonus = 0;
        if (message.content.includes('!')) {
            bonus += this.interrobangBonus;
            logger.debug(`Content bonus added for interrobang: ${this.interrobangBonus}`);
        }
        // Implement additional content checks here
        return bonus;
    }
}

const messageResponseManager = new MessageResponseManager();
module.exports = messageResponseManager;
