import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:430,height:930}});
page.on('console',msg=>{if(msg.type()==='error')console.log('BROWSER ERROR:',msg.text())});
page.on('pageerror',err=>console.log('PAGE ERROR:',err.message));
try{
 await page.goto('http://127.0.0.1:8123/',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForSelector('#categories .cat',{timeout:45000});
 await page.waitForSelector('#featuredGroups .group-mini',{timeout:45000});
 console.log('PASSED: Categories and Supabase-backed community groups rendered');
 const groupName=await page.locator('#featuredGroups .group-mini b').first().textContent();
 console.log('GROUP:',groupName);
 await page.screenshot({path:'home-live.png',fullPage:true});
 await page.getByRole('button',{name:/Grupos/}).last().click();
 await page.waitForSelector('#groupsList .group-card',{timeout:15000});
 await page.screenshot({path:'groups-live.png',fullPage:true});
 await page.getByRole('button',{name:/Perfil/}).last().click();
 await page.waitForSelector('#accountLogin',{timeout:15000});
 await page.screenshot({path:'ui-screenshot.png',fullPage:true});
 console.log('PASSED: navigation, groups, unauthenticated profile');
}finally{await browser.close()}
