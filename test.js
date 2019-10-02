const {Builder, By, Key, until} = require('selenium-webdriver');


// async function example(string) {
//   var translated;
//   var mult_table;
//   var test;
//   var i;
//   var array = [];
//   let driver = await new Builder().forBrowser('firefox').build();
//   try {
//     await driver.manage().setTimeouts({ implicit: 5000});
//     await driver.get('https://translate.google.com/?hl=en&tab=TT0#view=home&op=translate&sl=en&tl=vi');
//     await driver.findElement(By.id('source')).sendKeys(string, Key.RETURN);
//     translated = await driver.findElement(By.xpath(
//       "//span[@lang='vi']/span[1]"))
//       .getText();
//     console.log(translated);
//
//     await driver.wait(until.elementLocated(By.xpath("//table[@class='gt-baf-table']/tbody/tr[@class='gt-baf-entry']")));
//
//     test = await driver.findElement(By.xpath("//q")).getText();
//     console.log(test);
//
//     // test = await driver.findElement(By.xpath(
//     //   "//table[@class='gt-baf-table']/tbody/tr[@class='gt-baf-entry']")).rows.length;
//
//     console.log('meo');
//     // await driver.findElements(By.className('gt-baf-cell gt-baf-word-clickable')).then(async function(value){
//     //   console.log(value.length);
//     //
//     //   for (i = 0; i < value.length; i++){
//     //
//     //       array.push(await value[i].getText());
//     //   }
//     //
//     // });
//
//     // test = await driver.findElement(By.xpath("/html/body/div[2]/div[1]/div[2]/div[2]/div[3]/div[2]/div[1]/div[1]/div/div[2]/table/tbody/tr[2]/td[1]/div/span/span")).getText();
//
//   } finally {
//     await driver.quit();
//     return array;
//
//   }
// }
//
// example('neg');


const {google} = require('googleapis');
var youtube = google.youtube({
   version: 'v3',
   auth: ""
});


async function runSample(){
  const res = await youtube.search.list({
    part:'id,snippet',
    q: 'cat',
  });
  for (var i in res.data.items){
    console.log(res.data.items[i].snippet.title);//search title based on q
    console.log(res.data.items[i].id.kind); //check to see if channel or video
    //if video check you can use id.videoId
  }
}

runSample();
