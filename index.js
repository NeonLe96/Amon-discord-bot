const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const ytdl = require('ytdl-core');
const {Builder, By, Key, until} = require('selenium-webdriver');

const {google} = require('googleapis');
var youtube = google.youtube({
  version: 'v3',
  auth: "AIzaSyDi3DLiDo3taN871O2HmWJ1G_LChmni3QQ"
});

// Number emote to real number
function num_convert(input ){

  switch(input){
    case '1⃣':
      return 1;
    case '2⃣':
      return 2;
    case '3⃣':
      return 3;
    case '4⃣':
      return 4;
    case '5⃣':
      return 5;
    default:
      return;
  }
}
// Number emote to real number


//Search
async function yt_search(find_string){
  const res = await youtube.search.list({
    part:'id,snippet',
    q: find_string,
  });
  var return_array = [];
  var return_array_id = [];
  for (var i in res.data.items){
    // console.log(res.data.items[i].snippet.title);//search title based on q
    // console.log(res.data.items[i].id.kind); //check to see if channel or video
    //if video check you can use id.videoId
    return_array.push(res.data.items[i].snippet.title);
    return_array.push(res.data.items[i].id.kind);
    return_array_id.push(res.data.items[i].id.videoId);
  }
  return [return_array,return_array_id];
}
// Search


//ORA MUDA
function ora_muda_reply (input){
  var i;
  var str_in_question = input;
  var lowered = str_in_question.toLowerCase();
  var x = lowered.search("ora");
  var y = lowered.search("muda");
  var countx = (lowered.match(/ora/g) || []).length;
  var county = (lowered.match(/muda/g) || []).length;
  var ora_out = "";
  var ora = "ORA ";
  var muda_out = "";
  var muda = "MUDA ";

  if (x > -1){
    for (i=0 ; i < countx - 1 ; i++){
      muda_out = muda_out.concat(muda);
    }
    muda_out =muda_out.concat("MUDA!!!!");
    return muda_out;
  }else if (y > -1) {
    for (i=0 ; i < county - 1 ; i++){
      ora_out = ora_out.concat(ora);
    }
    ora_out = ora_out.concat("ORA!!!!");
    return ora_out;
  }
  return -1;
}
//ORA MUDA

// MAKE URL
function yt_url(id){
  var return_string = '';
  return_string = return_string.concat(id);
  return return_string;
}
// MAKE URL

// PLAY SONG
function play(from_yt_list){
  if(from_yt_list == null){
    return;
  }

  var dispatcher = conn_global.playStream(ytdl(yt_url(yt_fn_list[0],{ quality: 'lowestaudio', filter: 'audioonly' })))
    .on('end',()=>{
      console.log('Music Ended');
      yt_fn_list.shift();
      if(yt_fn_list.length > 0){
        play(yt_fn_list[0]);
      }else{
        conn_global = null;
      }
    })
    .on('error',error=>{
      console.error(error);
    });
    dispatcher.setVolume(0.25);
}
// PLAY SONG

//Translate
async function selinium(string) {
  var translated;
  var mult_table;
  var dummy;
  var test;
  var i;
  var array = [];
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.manage().setTimeouts({ implicit: 5000});
    await driver.get('https://translate.google.com/?hl=en&tab=TT0#view=home&op=translate&sl=en&tl=vi');
    await driver.findElement(By.id('source')).sendKeys(string, Key.RETURN);
    translated = await driver.findElement(By.xpath("//span[@lang='vi']/span[1]")).getText();
    array.push(translated);
    await driver.wait(until.elementLocated(By.xpath("//q")),500);
    dummy = await driver.findElement(By.xpath("//q")).getText();
    await driver.wait(until.elementLocated(By.xpath("//table[@class='gt-baf-table']/tbody/tr[@class='gt-baf-entry']")),500,'gay');
    await driver.findElements(By.className('gt-baf-cell gt-baf-word-clickable')).then(async function(value){
      for (i = 0; i < value.length; i++){
        test=await value[i].getText();
        if (translated == test){
          continue;
        }
        array.push(test);
      }
    });
    array.push(dummy);

  } finally {
    await driver.quit();
    return array;
  }
}
//Translate

// GLOBAL
var yt_fn_list =[];
var yt_id_list = [];
var conn_global;
// GLOBAL
client.once('ready', () => {
  console.log('Ready!');

});

// CUSTOM CODES ON EVENT

// CUSTOM CODES ON message
client.on('message', message => {

  var tokens=[];
  var sorted=[];
  var i;
  var final_string='';
  var final_final_string ='';
  tokens = message.content.split (" "); // WHERE THE USER TYPE THINGS EX: !translate cat


  // skip song

  if(tokens[0] == '!sk'){
    console.log('!sk');
    if(conn_global != null){
      conn_global.dispatcher.end();
    }
    if(yt_fn_list.length == 0){
      conn_global = null;
    }
  }

  // skip song

  //Translate
  for ( var i =0; i< tokens.length; i++){
    sorted.push(tokens[i].toLowerCase());
  }
  if(sorted[0] == "!translate"){
    if(tokens.length ==1){
      message.channel.send("FORMAT:\n !translate [word]");
      return;
    }
    message.channel.send("Translating...")
    if(tokens.length >= 2){
      var translated_arr = selinium(message.content.slice(10));
      translated_arr.then(function(arreh){
        console.log(arreh);
        final_string = final_string.concat(arreh[0]);
        for(i = 1; i < arreh.length -1; i++){
          final_string = final_string.concat(', ');
          final_string = final_string.concat(arreh[i]);
        }
        final_string = final_string.concat('.');
        final_final_string = final_final_string.concat('```bash\n== Định nghĩa: ==\n\"' + final_string + '\"');
        if ( typeof arreh[i] === 'undefined'){
          final_final_string = final_final_string.concat('\n```');
          message.channel.send(final_final_string);
          return;
        }
        message.channel.send('```bash\n== Định nghĩa: ==\n\"' + final_string + '\"\n\n== Ví dụ: == \n'+ arreh[i] +'```');
      });
    }
  }
  //Translate

  //FIND MUSIC AND ADD TO QUEUE AND maybe PLAY
  if(sorted[0] === "!p"){
    if(!message.member.voiceChannel){
      return;
    }
    yt_search(message.content.slice(2)).then(search_arr =>{
      var final_string = '';
      var j = 1;
      const react_arr =  ['1⃣','2⃣','3⃣','4⃣', '5⃣'];

      yt_id_list = search_arr[1];
      console.log(yt_id_list);
      for ( i = yt_id_list.length -1; i >= 0; i--){
        if(yt_id_list[i] == null || yt_id_list[i] == 'undefined' || yt_id_list[i] == undefined){
          yt_id_list.splice(i,1);
        }
      }
      console.log(yt_id_list);

      final_string = final_string.concat("```\nPICK YOUR 🎹🎵\n");
      for ( i = 0; i < search_arr[0].length; i++){
        if(search_arr[0][i+1] ==='youtube#video'){
          final_string = final_string.concat((j).toString(10));
          final_string = final_string.concat(': ');
          final_string = final_string.concat(search_arr[0][i]);
          final_string = final_string.concat('\n');
          j++;
          i++;
        }
      }
      final_string = final_string.concat('```');
      message.channel.send(final_string).then(async return_mess => {
        for (i = 0; i < j-1 ; i++){
          await return_mess.react(react_arr[i]);
        }
        // console.log(return_mess.reactions.find('count', false));
        var filter = (reaction) => reaction.count === 2;
        return_mess.awaitReactions(filter, { time: 5000, max: 1 })
          .then(collected => {

            console.log(collected.first().emoji.name);
            var choose_this = num_convert(collected.first().emoji.name);
            console.log(choose_this);
            yt_fn_list.push(yt_id_list[choose_this-1]);
            console.log(yt_fn_list);
            if(conn_global == null){
              message.member.voiceChannel.join().then( connection =>{
                conn_global = connection;
                play(yt_fn_list[0]);
              }
              )
            }else{

            }
          })
          .catch(console.error);
      })

    })
  }
  // find music and add to queue
  //TEXT COMMAND FOR MUSIC

  //TEXT COMMAND FOR MUSIC
  // Shroud Sub sound
  if(sorted[0] === "!shroud"){
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voiceChannel) {
      var voice_chan = message.member.voiceChannel;
      voice_chan.join().then(connection => { // Connection is an instance of VoiceConnection
        dispatcher = connection.playStream(ytdl('https://www.youtube.com/watch?v=D-UmfqFjpl0'));
        dispatcher.on('error', error =>
        {
          console.log(error);
        })
        dispatcher.on("end",end =>{
          voice_chan.leave();
        })
      })
      .catch(console.log);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
  // Shroud sub


  //delete
  if(message.content === "!delete"){
    message.channel.bulkDelete(2);
  }
  //delete

  if (!message.guild) return;
  var x = message.author;

  // ORA MUDA
  var fin_reply = ora_muda_reply(message.content);
  if ((fin_reply !== -1) && (!message.author.bot)) {
    message.channel.send(fin_reply);
  }
  // ORA MUDA

  // WTF
  if (message.content === '!wtf' || message.content === '!WTF') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voiceChannel) {
      var voice_chan = message.member.voiceChannel;
      voice_chan.join().then(connection => { // Connection is an instance of VoiceConnection
        message.reply('!?!?!?');
        dispatcher = connection.playFile('./littleshit.mp3');
        dispatcher.on('error', error =>
        {
          console.log(error);
        })
        dispatcher.on("end",end =>{
          voice_chan.leave();
        })
      })
      .catch(console.log);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
  // WTF


  // Voice leave
  if (message.content ==='!leave'){
    message.member.voiceChannel.leave();
  }
  //Voice Leave

  //Avatar function
  if (message.content === '!avatar') {
    // Send the user's avatar URL
    message.reply(message.author.avatarURL);
  }
  //Avatar function

});
// CUSTOM CODES ON message

// CUSTOM CODES ON ADD
client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === 'general');

  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`${member} , your mother is probably map vcl xd`);
});
// CUSTOM CODES ON ADD

// CUSTOM CODES ON EVENT

// GL HF


client.login('NTg5MDU3ODczMzg1MDk1MTc4.XQOJqQ.NVI6_MMx5qmE-w1Q3sH1eHY8XsU');
