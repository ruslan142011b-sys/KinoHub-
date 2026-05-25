const { Bot, InlineKeyboard, InlineQueryResultBuilder } = require("grammY");

const BOT_TOKEN = "8903767053:AAGiOQi3vRlAYy_4XIgBPnvdFWnI_jv-pQ4"; 
const bot = new Bot(BOT_TOKEN);

const moviesDatabase = [
    {
        id: "1",
        title: "Пацаны (The Boys)",
        description: "сериал | kp: 8.267 | imdb: 8.6 | 2019\nСША | фантастика, боевик, драма",
        thumb: "https://images.justwatch.com/poster/305545229/s166/the-boys.webp",
        caption: "🎬 **Пацаны (The Boys)**\n1 сезон 1 серия\n\n⚠️ Жми кнопку «Смотреть рекламу» чтобы Бесплатно открыть видео. Отключить рекламу можно с VIP-доступом 💝"
    },
    {
        id: "2",
        title: "Эйфория (Euphoria)",
        description: "сериал | kp: 7.511 | imdb: 8.2 | 2019\nСША | драма, мелодрама",
        thumb: "https://images.justwatch.com/poster/123841103/s166/euphoria.webp",
        caption: "🎬 **Эйфория (Euphoria)**\n1 сезон 1 серия\n\n⚠️ Жми кнопку «Смотреть рекламу» чтобы Бесплатно открыть видео. Отключить рекламу можно с VIP-доступом 💝"
    },
    {
        id: "3",
        title: "Первая ракетка",
        description: "сериал | kp: 7.835 | 2026\nРоссия | драма, спорт",
        thumb: "https://via.placeholder.com/100x150.png?text=Rocket",
        caption: "🎬 **Первая ракетка**\n1 сезон 1 серия\n\n⚠️ Жми кнопку «Смотреть рекламу» чтобы Бесплатно открыть видео. Отключить рекламу можно с VIP-доступом 💝"
    }
];

const createMovieKeyboard = (showAdButton = true) => {
    const keyboard = new InlineKeyboard();
    if (showAdButton) keyboard.text("▶️ Смотреть рекламу", "watch_ad").row();
    
    keyboard
        .text("FREE VIP Бесплатно", "vip_free")
        .text("💝 Купить VIP", "buy_vip").row()
        .text("⬅️ Назад", "prev")
        .text("🔢 Серии", "episodes")
        .text("Вперед ➡️", "next").row()
        .text("🎵 Озвучка", "audio")
        .text("🔮 Качество", "quality").row()
        .text("🔔 Уведомлять", "notify")
        .text("⭐ В избранное", "fav").row()
        .text("📱 Наши проекты", "projects").row();
    return keyboard;
};

const vipKeyboard = new InlineKeyboard()
    .text("🔤 Ввести промокод", "promo").row()
    .text("💳 VIP +3 года = 3000 RUB", "p_3y").row()
    .text("🔥 VIP +1 мес = 100 RUB", "p_1m").row()
    .text("⬅️ Назад к фильму", "back_to_movie").row();

bot.command("start", async (ctx) => {
    await ctx.reply(`👋 Привет, ${ctx.from.first_name}!\nДобро пожаловать в **KinoHub🍿**.\n\n🔥 Чтобы найти фильм, введи в поле ввода сообщения знак \`@\` и юзернейм этого бота через пробел!`, { parse_mode: "Markdown" });
});

bot.on("inline_query", async (ctx) => {
    const query = ctx.inlineQuery.query.toLowerCase();
    const searchResults = moviesDatabase.filter(m => m.title.toLowerCase().includes(query));
    
    const results = searchResults.map((m) => {
        return InlineQueryResultBuilder.article(`movie-${m.id}`, m.title, {
            description: m.description,
            thumbnail_url: m.thumb,
            reply_markup: createMovieKeyboard(true)
        }).text(m.caption, { parse_mode: "Markdown" });
    });
    
    await ctx.answerInlineQuery(results);
});

bot.on("callback_query:data", async (ctx) => {
    const data = ctx.callback_query.data;
    if (data === "watch_ad") {
        await ctx.answerCallbackQuery({ text: "▶️ Загрузка рекламного ролика..." });
        await ctx.editMessageText("🍿 **Фильм успешно разблокирован!** Приятного просмотра серии через KinoHub.", { reply_markup: createMovieKeyboard(false) });
    } else if (data === "buy_vip") {
        await ctx.answerCallbackQuery();
        await ctx.editMessageText("❓ **ЧТО ДАЕТ VIP В KINOHUB:**\n✨ Полное отсутствие рекламы\n✨ Безлимитный просмотр 24/7\n✨ Доступ к базе более 1 000 000 видеофайлов", { reply_markup: vipKeyboard });
    } else if (data === "back_to_movie") {
        await ctx.answerCallbackQuery();
        await ctx.editMessageText("🎬 Возвращаемся к карточке фильма...", { reply_markup: createMovieKeyboard(true) });
    }
});

bot.start();
const http = require("http");
http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("KinoHub is running!\n");
}).listen(process.env.PORT || 3000);
console.log("KinoHub запущен!");
