import { GuildMemberService } from '../../api/generated';
import Command from '../../classes/command';
import XPError, { XPErrorType } from '../../classes/xp-error';
import defaultEmbed, {
  DefaultEmbedType,
} from '../../helpers/messaging/default-embed';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { t } from 'i18next';

const execute = async (interaction: ChatInputCommandInteraction) => {
  const guildMemberService_ = GuildMemberService;

  const userId =
    interaction.options.getUser('user', false)?.id || interaction?.user?.id;
  const guildId = interaction?.guildId;
  if (!guildId) throw new XPError(XPErrorType.INTERACTION_GUILD_UNRESOLVABLE);
  if (!userId) throw new XPError(XPErrorType.INTERACTION_USER_UNRESOLVABLE);

  const guildMember = await guildMemberService_.getGuildMember({
    guildId,
    userId,
  });

  if (guildMember.settings.incognito) {
    const embed = defaultEmbed(DefaultEmbedType.INFO);
    embed
      .setTitle('Incognito')
      .setDescription(
        interaction.user.id === userId
          ? 'You are currently in incognito mode. Your ranking card is hidden.'
          : 'This user is currently in incognito mode. Their ranking card is hidden.',
      );

    interaction.reply({ embeds: [embed] });
    return;
  }

  interaction.reply(
    `${process.env.API}rank/${guildId}/${userId}?${Date.now()}`,
  );
};

export default new Command(
  new SlashCommandBuilder().setName('rank').addUserOption((o) =>
    o
      .setName('user')
      .setDescription('The user you want to recieve the RankingCard from.')
      .setNameLocalizations({
        de: t(['command_info.option.user.name', 'user'], {
          ns: 'rank_command',
          lng: 'de',
        }),
        'en-US': t(['command_info.option.user.name', 'user'], {
          ns: 'rank_command',
          lng: 'en',
        }),
      })
      .setDescriptionLocalizations({
        de: t(
          [
            'command_info.option.user.description',
            'The user you want to recieve the RankingCard from.',
          ],
          {
            ns: 'rank_command',
            lng: 'de',
          },
        ),
        'en-US': t(
          [
            'command_info.option.user.description',
            'The user you want to recieve the RankingCard from.',
          ],
          {
            ns: 'rank_command',
            lng: 'en',
          },
        ),
      })
      .setRequired(false),
  ),
  execute,
);
