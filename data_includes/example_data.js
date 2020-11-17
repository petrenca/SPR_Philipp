
PennController.ResetPrefix(null);
// PennController.DebugOff() // use for the final version
PennController.AddHost("https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/"); // loads pictures from external server (pre-test 3 only)

// --------------------------------------------------------------------------------------------------------------  
// Preamble

var progressBarText = "Verbleibend"; //Changes the text of the progress bar

const replacePreloadingMessage = ()=>{   //Changes the Preloading Message
    const preloadingMessage = $(".PennController-PennController > div");
if (preloadingMessage.length > 0 && preloadingMessage[0].innerHTML.match(/^<p>Please wait while the resources are preloading/))
    preloadingMessage.html("<p>Bitte warten Sie einen Moment, w&auml;hrend die Medien laden. Dies kann bis zu 1 Minute dauern.</p>");
window.requestAnimationFrame( replacePreloadingMessage );
};
window.requestAnimationFrame( replacePreloadingMessage );

// --------------------------------------------------------------------------------------------------------------
// Create dashed function
dashed = (sentence, remove) => {
    let words = sentence.split('*'),  blanks = words.map(w=>w.split('').map(c=>'_').join('') );
    let textName = 'dashed'+words.join('');
    // We'll return cmds: the first command consists in creating (and printing) a Text element with dashes
    let cmds = [ newText(textName, blanks.join(' ')).print() .settings.css("font-family","courier") .settings.css("font-size", "20px") .print("20vw","50vh")]; // COURIER as font
    // We'll go through each word, and add two command blocks per word
    for (let i = 0; i <= words.length; i++)
    cmds = cmds.concat([ newKey('dashed'+i+words[i], " ").log().wait() , // Wait for (and log) a press on Space
    getText(textName).text(blanks.map((w,n)=>(n==i?words[n]:w)).join(' ')) ]); // Show word
    if (remove)  // Remove the text after the last key.wait() is parameter specified
    cmds.push(getText(textName).remove());
    return cmds;
};

// --------------------------------------------------------------------------------------------------------------
// Establish sequence, with randomised items
PennController.Sequence( "demographics", "instructions1","preloadCritical", "preloadPost_task", "practice_trials", "instructions2", subsequence(repeat(shuffle(randomize("critical_trials")), 5) , "break"), "post-instructions", "post-ques", "post_task_intro", "post_task", "end_post_task" , "send", "final");
//PennController.Sequence( "instructions2", "preloadCritical", "preloadPost_task", "practice_trials", subsequence(repeat(shuffle(randomize("critical_trials")), 5) , "break"), "post-instructions", "post-ques", "post-task-intro", "post-task",  "send", "final");


//====================================================================================================================================================================================================================
// 1. Welcome page/demographics
PennController("demographics",
               // ENTER Clickworker ID
               newText("welcometext", "<p><b>Herzlich willkommen zu unserem Experiment!</b><p>")
               .settings.css("font-size", "30px")
               ,
               newCanvas("welcomecanvas", 1000, 125)
               .settings.add("center at 50%", 0, getText("welcometext") )
               .print()
               ,
               newTextInput("cwID", "")
               .before(newText("cwID", "Bevor wir beginnen, geben Sie bitte Ihre Clickworker-ID ein: ")
                       .settings.css("font-size", "20px"))
               .size(100, 20)
               .settings.center()
               .print()
               ,
               newText("blank","<p>")
               .print()
               ,
               newButton("start", "Weiter")
               .settings.center()
               .print()
               .wait(getTextInput("cwID")
                     .test.text(/[^\s]+/)  // this makes sure that it's not left blank
                     .success()
                     .failure(
                         newText("IDerror","<p><br>Bitte tragen Sie bitte Ihre Clickworker-ID ein.<p>")
                         .settings.color("red")
                         .settings.center()
                         .print()
                     ))
               ,  
               getCanvas("welcomecanvas")
               .remove()
               ,
               getTextInput("cwID")
               .remove()
               ,
               getButton("start")
               .remove()
               ,
               getText("IDerror")
               .remove()
               
               // ENTER DEMOGRAPHICS
               ,
               newText("welcometext2", "<p>Um an unserem Experiment teilnehmen zu k&ouml;nnen, ben&ouml;tigen wir Angaben zu Ihrer Person. Diese werden anonym ausgewertet. Genauere Informationen entnehmen Sie bitte dem Informationsblatt f&uuml;r Proband*innen.<p>")              
               .settings.css("font-size", "20px")
               ,
               newCanvas("welcomecanvas2", 1000, 125)
               .settings.add(0, 0, getText("welcometext2") )
               .print()
               ,
               newDropDown("age", "")
               .settings.add( "17 oder junger" , "18" , "19" , "20", "21" , "22" , "23", "24" , "25" , "26", "27" , "28" , "29", "30" , "31" , "32 oder &auml;lter" )
               ,
               newText("agetext", "Alter:")
               .settings.css("font-size", "20px")
               .settings.bold()
               //.settings.after( getDropDown("age") )    
               ,
               newCanvas("agecanvas", 1000, 45)
               .settings.add(0, 10, getText("agetext") )
               .settings.add(100, 8, getDropDown("age") )
               .print()    
               ,
               newText("Geschlecht", "Geschlecht:")
               .settings.css("font-size", "20px")
               .settings.bold()
               ,
               newDropDown("sex", "" )
               .settings.add( "&nbsp;weiblich&nbsp;", "&nbsp;m&auml;nnlich&nbsp;", "&nbsp;divers&nbsp;")
               ,
               newCanvas("sexcanvas", 1000, 40)
               .settings.add(0, 0, getText("Geschlecht") )
               .settings.add(120, 3, getDropDown("sex") )
               .print()
               ,
               newText("SpracheTest", "Haben Sie bis zum 5. Lebensjahr au&szlig;er Deutsch eine weitere Sprache gelernt?")
               .settings.css("font-size", "20px")
               .settings.bold()
               ,
               newTextInput("und zwar", "")
               .settings.hidden()
               ,
               newText("label input", "")
               .settings.after( getTextInput("und zwar") )
               ,
               newDropDown("language", "")
               .settings.log()
               .settings.add(  "nein", "ja, und zwar:")    
               .settings.after(  getText("label input") )
               .settings.callback(                                             //whenever an option is selected, do this:
                   getDropDown("language")
                   .test.selected("ja, und zwar:")                             //reveal the input box
                   .success( getTextInput("und zwar").settings.visible() )     //hide the input box
                   .failure( getTextInput("und zwar").settings.hidden()  )   
               )        
               ,
               newCanvas("languagecanvas", 1000, 25)
               .settings.add(0, 0, getText("SpracheTest") )
               .settings.add(690, 2, getDropDown("language") )
               .print()
               ,
               newText("<p> ")
               .print()
               ,
               newText("information", "<p>Bevor das Experiment beginnen kann, sollten Sie das <a href='https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/documentation/probanden_info_ONLINE_LifeFact.pdf' target='_blank' >Probandeninformationsblatt</a> sowie die <a href='https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/documentation/einversta%CC%88ndnis_ONLINE_LifeFact.pdf' target='_blank' >Einwilligungserkl&auml;rung</a> lesen.<p>")    
               .settings.css("font-size", "20px")
               ,
               newText("browser_info", "<p>Bitte beachten Sie, dass dieses Experiment nur mit den Browsern <b>Mozilla Firefox</b> und <b>Google Chrome</b> getestet wurde und nicht auf mobilen Ger&auml;ten funktioniert.<p>")
               .settings.css("font-size", "20px")
               ,
               newCanvas("infocanvastwo", 1000, 180)
               .settings.add(0, 0, getText("browser_info") )
               .settings.add(0, 90, getText("information") )
               .print()
               ,
               newButton("okay", "Ich habe das Probandeninformationsblatt sowie die Einwilligungserkl&auml;rung gelesen und erkl&auml;re mich mit diesen einverstanden.")
               .settings.css("font-size", "15px")        
               .print()
               .wait()  
               ,
               newText("<p> ")
               .print()
               ,
               newButton("start2", "Experiment beginnen")
               .settings.center()  
               ,
               getDropDown("age")
               .test.selected()
               .success()
               .failure(
                   newText("Bitte geben Sie Ihr Alter an.")
                   .settings.color("red")
                   .print())   
               ,
               getDropDown("sex")
               .test.selected()
               .success()
               .failure(
                   newText("Bitte geben Sie Ihr Geschlecht an.")
                   .settings.color("red")
                   .print())
               ,
               getDropDown("language")
               .test.selected()
               .success()
               .failure(
                   newText("Bitte beantworten Sie die Frage zum Spracherwerb.")                   
                   .settings.color("red")
                   .print())      
               ,
               getDropDown("age").wait("first")
               ,
               getDropDown("sex").wait("first")
               ,
               getDropDown("language").wait("first")
               ,
               getButton("start2")
               .print()
               .wait()
               ,
               newVar("IDage")
               .settings.global()
               .set( getDropDown("age") )
               ,
               newVar("IDsex")
               .settings.global()
               .set( getDropDown("sex") )
               ,
               newVar("IDling")
               .settings.global()
               .set( getDropDown("language") )
               ,
               newVar("IDund zwar")
               .settings.global()
               .set( getTextInput("und zwar") )
               ,
               newVar("cwID")
               .settings.global()
               .set( getTextInput("cwID") )
              )  
    
    .log("clickworkerID", getVar("cwID"))
    .log( "age", getVar("IDage"))
    .log( "sex", getVar("IDsex"))
    .log( "L2", getVar("IDling"))
    .log( "whichL2", getVar("IDund zwar"))
    .log( "item" , "demo" )
    .log( "type" , "demo" )              
    .log( "version" , "demo")
    .log( "letter" , "demo")
    .log( "sentence" , "demo")
    .log( "name" , "demo")  
    .log( "year" , "demo")
    .log( "fact" , "demo")
    .log( "photo" , "demo")
    .log( "full_sentence" , "demo")
    .log( "condition" , "demo")
    .log( "life_mismatch" , "demo")
    .log( "fact_mismatch" , "demo")
    .log( "year_time" , "demo")
    .log( "fact_time" , "demo")
    .log( "year_fact" , "demo")
    .log( "list" , "demo")
    .log( "life_status" , "demo")
    .log( "yes_key" , "demo")
    .log( "occupation" , "demo")
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);        //end of welcome screen

//====================================================================================================================================================================================================================
// 2. Intro/instructions
PennController( "instructions1" ,
                newText("intro_instructions", "<p><b>Vielen Dank, dass Sie an diesem Experiment teilnehmen!</b><p><br><p>Das Experiment besteht aus vier Teilen: einer kurzen &Uuml;bungsrunde, dem Experiment selbst und zwei kurzen Frageb&ouml;gen. Insgesamt wird es ungef&auml;hr 15 Minuten dauern.<p> <p>Bitte versuchen Sie, das Experiment in einer angemessenen Zeit zu beenden. Sollten Sie l&auml;nger als 30 Minuten ben&ouml;tigen, sind Ihre Daten f&uuml;r uns nicht verwertbar.<p>")
                .settings.css("font-size", "20px")
                ,
                newText("weiter", "<p>Dr&uuml;cken Sie die <b>Leertaste</b>, um weiter fortzufahren.<p>")
                .settings.css("font-size", "20px")
                .settings.color("red")
                ,
                newCanvas("introcanvas",900, 450)
                .settings.add(0,0, getText("intro_instructions"))
                .settings.add(0,250, getText("weiter"))
                .print()   
                ,
                newKey("intro_instructions"," ")
                .wait()
                ,
                getCanvas("introcanvas")
                .remove()
                ,
                newTimer("intro", 500)
                .start()
                .wait()
                ,
                newText("intro_instructions2", "<p>In diesem Experiment werden Sie die Fotos verschiedener ber&uuml;hmter Pers&ouml;nlichkeiten aus aller Welt sehen. Einige dieser Pers&ouml;nlichkeiten werden Sie kennen, andere m&ouml;glicherweise nicht.<p><br>Sobald ein Foto erscheint, legen Sie Ihren <b>linken Zeigefinger</b> auf die Taste '<b>F</b>' und Ihren <b>rechten Zeigefinger</b> auf die Taste '<b>J</b>'. Dr&uuml;cken Sie <b>mit dem linken Zeigefinger = 'Ja'</b>, falls Sie diese Person kennen, und <b>mit dem rechten Zeigefinger = 'Nein'</b>, falls Sie diese Person nicht kennen.<p><p>Als N&auml;chstes werden Sie einen Satz sehen, der in Bl&ouml;cken pr&auml;sentiert wird und eine vergangene, gegenw&auml;rtige oder zuk&uuml;nftige Leistung der Person beschreibt. Sie werden jeweils nur einen Satzteil sehen. Um zum n&auml;chsten Satzteil fortzufahren, dr&uuml;cken Sie die <b>Leertaste</b>. <p>Danach wird Ihnen eine Bewertungsskala angezeigt. Ihre Aufgabe ist es, zu bewerten, wie gut der Satz zu dem Foto passt, und zwar <b>auf der Skala von 1 (gar nicht) bis 7 (sehr)</b>.<p> <p>Einige der S&auml;tze werden passen, einige werden falsch sein, und einige andere liegen irgendwo dazwischen. Nachdem Sie den Satz bewertet haben, dr&uuml;cken Sie die <b>Leertaste</b>, um fortzufahren.<p><br> Um Ihnen den Einstieg zu erleichtern, blenden wir Ihnen die Anweisungen w&auml;hrend der Beispielrunde in <b>Rot</b> ein. F&uuml;r das tats&auml;chliche Experiment bekommen Sie aber nur die Fotos, S&auml;tze und die Bewertungsskala gezeigt.<p>")
                .settings.css("font-size", "20px")
                ,
                newText("weiter2", "<p><br>Dr&uuml;cken Sie die <b>Leertaste</b>, um mit den Beispielen zu beginnen.<p>")
                .settings.css("font-size", "20px")
                .settings.color("red") 
                ,
                newCanvas("introcanvas2",900, 670)
                .settings.add(0,0, getText("intro_instructions2"))
                .settings.add(0,480, getText("weiter2"))
                .print()
                ,
                newKey("prac_start", " ")
                .wait()
                ,
                getCanvas("introcanvas2")
                .remove()
                ,
                newTimer("intro", 500)
                .start()
                .wait()
               )
    
    .log("clickworkerID", getVar("cwID"))
    .log( "age", getVar("IDage"))
    .log( "sex", getVar("IDsex"))
    .log( "L2", getVar("IDling"))
    .log( "whichL2", getVar("IDund zwar"))
    .log( "item" , "instructions" )
    .log( "type" , "instructions" )              
    .log( "version" , "instructions")
    .log( "letter" , "instructions")
    .log( "sentence" , "instructions")
    .log( "name" , "instructions")  
    .log( "year" , "instructions")
    .log( "fact" , "instructions")
    .log( "photo" , "instructions")
    .log( "full_sentence" , "instructions")
    .log( "condition" , "instructions")
    .log( "life_mismatch" , "instructions")
    .log( "fact_mismatch" , "instructions")
    .log( "year_time" , "instructions")
    .log( "fact_time" , "instructions")
    .log( "year_fact" , "instructions")
    .log( "list" , "instructions")
    .log( "life_status" , "instructions")
    .log( "yes_key" , "instructions")
    .log( "occupation" , "instructions")
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 3. Preloading

CheckPreloaded( "practice_trials",10000)
    .label( "preloadPractice" );

CheckPreloaded( "critical_trials", 20000)
    .label( "preloadCritical" );

CheckPreloaded( "post_task", 10000)
    .label( "preloadPost_task" )
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 4. Practice items
PennController.Template( PennController.GetTable("practice.csv"), // use subset.csv for celebrity names
                         variable => PennController( "practice_trials",
                                                     newText ("instructions_example_pic","Ihnen bekannt?<p>")
                                                     .settings.css("font-size", "20px")
                                                     .settings.center()
                                                     .settings.color("red")
                                                     .print()
                                                     ,
                                                     newImage("example_pic",  variable.file_name)
                                                     .settings.size(400)
                                                     .settings.center()
                                                     .print()
                                                     ,  
                                                     newText ("instructions_example_pic2"," <p><b>links = 'Ja' / rechts = 'Nein'</b><p>")
                                                     .settings.css("font-size", "20px")
                                                     .settings.center()
                                                     .settings.color("red")
                                                     .print()
                                                     ,
                                                     newTimer("delay", 200)    //no button can be pressed before 200ms
                                                     .start()
                                                     .wait()
                                                     ,                           
                                                     newKey("q_example_pic", "FJ")
                                                     .settings.log()
                                                     .wait()                                   
                                                     ,
                                                     getImage("example_pic")
                                                     .remove()
                                                     ,
                                                     getText("instructions_example_pic")
                                                     .remove()
                                                     ,
                                                     getText ("instructions_example_pic2")
                                                     .remove()
                                                     ,
                                                     getKey("q_example_pic")
                                                     .remove()
                                                     ,
                                                     getKey("q_example_pic")
                                                     .test.pressed("F")
                                                     .success
                                                     (      
                                                         
                                                         newCanvas("crit_instructions", 600, 200)
                                                         .center()
                                                         .add("center at 50%","middle at 50%",newText ("crit_instru","Dr&uuml;cken Sie die <b>Leertaste</b>,um den n&auml;chsten Satzteil anzusehen.")
                                                              .settings.css("font-size", "20px")
                                                              .settings.center()
                                                              .settings.color("red"))
                                                         .print()
                                                         ,     
                                                         ...dashed(variable.sentence_spr, "remove")
                                                     ,
                                                     getCanvas("crit_instructions")
                                                     .remove()
                                                     ,
                                                     newCanvas("bio_instructions", 800, 200)
                                                     .center()
                                                     .add("center at 50%","middle at 50%",newText ("scale_title", "Wie gut passt der Satz in Bezug auf die gezeigte Pers&ouml;nlichkeit?")
                                                          .settings.css("font-size", "20px")
                                                          .settings.center()
                                                          .settings.color("red"))
                                                     .print()
                                                     ,
                                                     newScale("rating", 7)
                                                     .settings.before( newText("left", "gar nicht").settings.css("font-size", "20px"))
                                                     .settings.after( newText("right", "sehr").settings.css("font-size", "20px"))
                                                     ,
                                                     newCanvas("introcanvas", 380,50)
                                                     .settings.center()
                                                     .settings.add("center at 50%", "middle at 50%", getScale("rating") )
                                                     .print()
                                                     ,
                                                     getScale("rating")
                                                     .wait()
                                                     ,
                                                     newText("finish", "<p>")
                                                     .print()
                                                     ,
                                                     newText ("instructions_continue", "<p>Dr&uuml;cken Sie bitte die <b>Leertaste</b>, um weiter fortzufahren.<p>")
                                                     .settings.css("font-size", "20px")
                                                     .settings.color("red")
                                                     .settings.center()
                                                     .print()
                                                     ,
                                                     newKey("finish"," ")
                                                     .wait()
                                                     ,   
                                                     getText("finish")
                                                     .remove()  
                                                     , 
                                                     getCanvas("introcanvas")
                                                     .remove()
                                                     ,      
                                                     getText("scale_title")
                                                     .remove()
                                                     ,
                                                     getText ("instructions_continue")
                                                     .remove()
                                                     ,         
                                                     newText("pleasewait", "...")
                                                     .settings.css("font-size", "25px")
                                                     .settings.center()
                                                     .settings.bold()
                                                     .print()
                                                     ,
                                                     newTimer("wait", 1000)
                                                     .start()
                                                     .wait()
                                                     ,
                                                     getText("pleasewait")
                                                     .remove()
                                                     ,
                                                     newVar("rating") // this will create a new variable "ID"; MUST be after the 'Start' button click
                                                     .settings.global()
                                                     .set(getScale("rating") ) // setting the value of "ID" to be the input from "ID above"
                                                    )
                         .failure
                         (
                             newText ("failure", "<p>Wenn Sie die Person nicht kennen, machen Sie mit der n&auml;chsten Person weiter.<p>")
                             .settings.css("font-size", "20px")
                             .settings.color("red")
                             .settings.center()  
                             .print()   
                             ,
                             newText ("instructions_continue2", "<p>Dr&uuml;cken Sie bitte die <b>Leertaste</b>, um weiter fortzufahren.<p>")  
                             .settings.css("font-size", "20px")
                             .settings.center()  
                             .settings.color("red")
                             .print()
                             ,
                             newKey("continue2" ," ")
                             .print()
                             .wait()
                             ,
                             getText("instructions_continue2")
                             .remove()
                             ,  
                             getKey("continue2")
                             .remove()
                         ))
    
    .log("clickworkerID", getVar("cwID"))                          
    .log( "age", getVar("IDage"))
    .log( "sex", getVar("IDsex"))
    .log( "L2", getVar("IDling"))
    .log( "whichL2", getVar("IDund zwar"))
    .log( "item" , variable.item )
    .log( "type" , variable.type )              
    .log( "version" , variable.version)
    .log( "letter" , variable.letter)
    .log( "sentence" , variable.sentence)
    .log( "name" , variable.name)  
    .log( "year" , variable.year)
    .log( "fact" , variable.fact)
    .log( "photo" , variable.file_name)
    .log( "full_sentence" , variable.full_sentence)
    .log( "condition" , variable.condition)
    .log( "life_mismatch" , variable.life_mismatch)
    .log( "fact_mismatch" , variable.fact_mismatch)
    .log( "year_time" , variable.year_time)
    .log( "fact_time" , variable.fact_time)
    .log( "year_fact" , variable.year_fact)
    .log( "list" , variable.list)
    .log( "life_status" , variable.life_status)
    .log( "yes_key" , variable.yes_F)
    .log( "occupation" , variable.occupation)
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true)
    );

//====================================================================================================================================================================================================================
// 5. Instructions before experiment
PennController( "instructions2" ,
                newText("intro_experiment", "<p>Die &Uuml;bungsrunde ist abgeschlossen. Jetzt wird das Experiment beginnen.<p><br> <p>Ihnen wird immer zuerst ein Foto gezeigt und anschlie&szlig;end ein Satz und eine Bewertungsskala.<p>")
                .settings.css("font-size", "20px")
                ,
                newText("intro_experiment2", "<p>Sobald ein Foto erscheint, legen Sie Ihren <b>linken Zeigefinger</b> auf die Taste '<b>F</b>' und Ihren <b>rechten Zeigefinger</b> auf die Taste '<b>J</b>'.<p>")
                .settings.css("font-size", "20px")
                .settings.color("red")
                ,
                newText("intro_experiment2_1","<p><b>1.</b> Anworten Sie bitte ob Sie die Person kennen: <b>linker Zeigefinger = 'Nein' / rechter Zeigefinger = 'Ja'</b>.<p><p><b>2.</b> Lesen Sie den Satz: <b>um zum n&auml;chsten Satzteil fortzufahren, dr&uuml;cken Sie die Leertaste</b>.<p> <p><b>3.</b> Bewerten Sie, wie gut der Satz zu dem Foto passt: <b>auf der Skala von 1 (gar nicht) bis 7 (sehr)</b>. Nachdem Sie den Satz bewertet haben, dr&uuml;cken Sie die <b>Leertaste</b>, um fortzufahren.<p>")
                .settings.css("font-size", "20px")
                ,
                newText("intro_experiment3", "<p>Nachdem Sie die H&auml;lfte der Fragen beantwortet haben, wird es eine kurze Pause von 20 Sekunden geben. Nutzen Sie diese, um sich kurz zu entspannen oder die Augen vom Bildschirm zu nehmen. Viel Spa&szlig;!</p>")
                .settings.css("font-size", "20px")        
                ,
                newCanvas("instructions_canvas", 880, 475)
                .settings.add(0, 0, getText("intro_experiment") )
                .settings.add(0, 120, getText("intro_experiment2") )
                .settings.add(0, 200, getText("intro_experiment2_1") )
                .settings.add(0, 360, getText("intro_experiment3") )
                .print()    
                ,
                newButton("start_experiment3" ,"Experiment beginnen")
                .settings.center()
                .print()
                .wait()
                ,
                getCanvas("instructions_canvas")
                .remove()
                ,
                getButton("start_experiment3")
                .remove()
                ,
                newText("instructions_key", "<br><b>Legen Sie Ihre Zeigefinger auf die Tasten und dr&uuml;cken Sie die 'Ja-Taste', um  das Experiment zu beginnen.</b></br>")
                .settings.css("font-size", "20px")
                .settings.center()
                .print()
                ,
                newKey("continue_Ja", "F")
                .wait()
                ,  
                getText("instructions_key")
                .remove()
                ,
                newTimer(1000)
                .start()
                .wait()
               )                                //end of experiment instructions screen 
    
    .log("clickworkerID", getVar("cwID"))
    .log( "age", getVar("IDage"))
    .log( "sex", getVar("IDsex"))
    .log( "L2", getVar("IDling"))
    .log( "whichL2", getVar("IDund zwar"))
    .log( "item" , "instructions" )
    .log( "type" , "instructions" )              
    .log( "version" , "instructions")
    .log( "letter" , "instructions")
    .log( "sentence" , "instructions")
    .log( "name" , "instructions")  
    .log( "year" , "instructions")
    .log( "fact" , "instructions")
    .log( "photo" , "instructions")
    .log( "full_sentence" , "instructions")
    .log( "condition" , "instructions")
    .log( "life_mismatch" , "instructions")
    .log( "fact_mismatch" , "instructions")
    .log( "year_time" , "instructions")
    .log( "fact_time" , "instructions")
    .log( "year_fact" , "instructions")
    .log( "list" , "instructions")
    .log( "life_status" , "instructions")
    .log( "yes_key" , "instructions")
    .log( "occupation" , "instructions")
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);  

//====================================================================================================================================================================================================================
// Critical items
PennController.Template( PennController.GetTable("master_stimuli_spr.csv") // use subset.csv for celebrity names
                         .filter("type" , "critical")
                         ,
                         variable => PennController( "critical_trials"
                                                     ,
                                                     newImage("picture", variable.file_name)
                                                     .settings.size(400)                                                      
                                                     .center()
                                                     .print()
                                                     ,
                                                     newTimer("delay6", 200)
                                                     .start()
                                                     .wait()
                                                     ,
                                                     newKey("question_pic", "FJ")
                                                     .settings.log()
                                                     .wait()                                   
                                                     ,
                                                     getImage("picture")
                                                     .remove()
                                                     ,  
                                                     getKey("question_pic")
                                                     .remove()
                                                     ,   
                                                     getKey("question_pic")
                                                     .test.pressed("F")
                                                     .success
                                                     (      
                                                         ...dashed(variable.sentence_spr, "remove")
                                                     ,
                                                     newScale("rating", 7)
                                                     .settings.before( newText("left", "gar nicht") .settings.css("font-family","times new roman"))
                                                     .settings.after( newText("right", "sehr") .settings.css("font-family","times new roman"))
                                                     ,
                                                     newCanvas("introcanvas", 380,50)
                                                     .settings.center()
                                                     .settings.add("center at 50%", "middle at 50%", getScale("rating") )
                                                     .print()
                                                     ,
                                                     getScale("rating")
                                                     .wait()
                                                     ,
                                                     newKey("finish"," ")
                                                     .wait()
                                                     ,   
                                                     getCanvas("introcanvas")
                                                     .remove()
                                                     ,                             
                                                     newText("pleasewait", "...")
                                                     .settings.css("font-size", "25px")
                                                     .settings.center()
                                                     .settings.bold()
                                                     .print()
                                                     ,
                                                     newTimer("wait", 1000)
                                                     .start()
                                                     .wait()
                                                     ,
                                                     getText("pleasewait")
                                                     .remove())
                         .failure
                         (
                             
                             newText("pleasewait2", "...")
                             .settings.css("font-size", "25px")
                             .settings.center()
                             .settings.bold()
                             .print()
                             ,
                             newTimer("wait2", 1000)
                             .start()
                             .wait()
                             ,
                             getText("pleasewait2")
                             .remove()
                         ))                     
    
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("IDund zwar"))
    .log( "item" , variable.item )
    .log( "type" , variable.type ) // 20.04.2020 DP changed from "pratice_trial" to "type"
    .log( "item" , variable.item)
    .log( "version" , variable.version)
    .log( "letter" , variable.letter)
    .log( "sentence" , variable.sentence)
    .log( "name" , variable.name)  
    .log( "year" , variable.year)
    .log( "fact" , variable.fact)
    .log( "full_sentence" , variable.full_sentence)
    .log( "condition" , variable.condition)
    .log("life_mismatch", variable.life_mismatch)
    .log("fact_mismatch", variable.fact_mismatch)
    .log( "list" , variable.list)
    .log("type", variable.type)  
    .log( "occupation" , variable.occupation)
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") )
    
    );


//====================================================================================================================================================================================================================
// 7. Break

PennController( "break" ,
                newText("break_text", "<p><b>Zeit f&uuml;r eine kleine Pause!</b> <br><p>Dr&uuml;cken Sie die Leertaste, um fortzufahren, oder entspannen Sie sich und nehmen Sie kurz die Augen vom Bildschirm.<br><p><b>Das Experiment geht nach 20 Sekunden automatisch weiter.</br></b><p>")
                .settings.css("font-size", "20px")
                .settings.center()
                .print()    
                ,
                newTimer("break_timer", 20000)
                .start()                
                ,
                newKey("continue_exp", " ")                 
                .callback( getTimer("break_timer").stop() )   
                ,
                getTimer("break_timer")
                .wait("first")
                ,
                getText("break_text")
                .remove()                
                ,
                getKey("continue_exp")
                .remove()   
                ,
                newText("instructions_key2", "<br><b>Legen Sie Ihre Zeigefinger auf die Tasten und dr&uuml;cken Sie die 'Ja-Taste', um  das Experiment zu beginnen.</b></br>")
                .settings.css("font-size", "20px")
                .settings.center()
                .print()
                ,
                newKey("continue_Ja", "F")
                .wait()
                ,  
                getText("instructions_key2")
                .remove()                  
                ,
                newTimer(1000)
                .start()
                .wait()             
               )    
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("IDund zwar"))
    .log( "item" , "break" )
    .log( "type" , "break" )              
    .log( "version" , "break")
    .log( "letter" , "break")
    .log( "sentence" , "break")
    .log( "name" , "break")  
    .log( "year" , "break")
    .log( "fact" , "break")
    .log( "photo" , "break")
    .log( "full_sentence" , "break")
    .log( "condition" , "break")
    .log( "life_mismatch" , "break")
    .log( "fact_mismatch" , "break")
    .log( "list" , "break")
    .log( "life_status" , "break")
    .log( "yes_key" , "break")
    .log( "occupation" , "break")
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 8. Comprehension test explanation screen // 14.05.2020 PM added and changed numbering; should this count towards progress?

PennController( "post_task_intro",
                newText("comp1_1", "<p>Der haupts&auml;chliche Teil des Experiments ist nun abgeschlossen. <b>Bitte bleiben Sie aber unbedingt noch bis zum Ende!</b><p>")
                .settings.css("font-size", "20px")
                ,        
                newText("comp1_2", "<p>Es folgt nun noch ein kurzer Verst&auml;ndnistest, um sicherzustellen, dass Sie w&auml;hrend des Experiments aufmerksam und konzentriert waren bzw. Ihre Antworten bewusst getroffen haben.<p>")
                .settings.css("font-size", "20px")
                ,
                newText("comp1_3", "<p>Ihnen werden gleich mehrere Fotos einzeln nacheinander gezeigt. Bitte antworten Sie, ob diese im Experiment vorkamen: <b>linker Zeigefinger = 'Ja' / rechter Zeigefinger = 'Nein'</b>.<p>")
                .settings.css("font-size", "20px")
                ,
                newCanvas("compCanv", 830, 300)
                .settings.add(0,0, getText("comp1_1"))
                .settings.add(0,100, getText("comp1_2")  )
                .settings.add(0,200, getText("comp1_3")  )
                .print()   
                ,
                newButton("compStart", "Verst&auml;ndnistest beginnen")
                .settings.center()
                .print()
                .wait()
               )
    .log("clickworkerID", getVar("cwID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("IDund zwar"))
    .log( "item" , "instructions" )
    .log( "type" , "instructions" )              
    .log( "version" , "instructions")
    .log( "letter" , "instructions")
    .log( "sentence" , "instructions")
    .log( "name" , "instructions")  
    .log( "year" , "instructions")
    .log( "fact" , "instructions")
    .log( "photo" , "instructions")
    .log( "full_sentence" , "instructions")
    .log( "condition" , "instructions")
    .log( "life_mismatch" , "instructions")
    .log( "fact_mismatch" , "instructions")
    .log( "year_time" , "instructions")
    .log( "fact_time" , "instructions")
    .log( "year_fact" , "instructions")
    .log( "list" , "instructions")
    .log( "life_status" , "instructions")
    .log( "yes_key" , "instructions")
    .log( "occupation" , "instructions")
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 9. Comprehension test

PennController.Template( PennController.GetTable( "master_stimuli_spr.csv")// change this line for the appropriate experimental list
                         .filter("type" , "post-task")
                         ,  
                         variable => PennController( "post_task",
                                                     newImage("picture_post_task", variable.file_name)
                                                     .settings.size(400)                                                      
                                                     .center()
                                                     .print()
                                                     ,
                                                     newTimer("delay11", 200)
                                                     .start()
                                                     .wait()
                                                     ,
                                                     newKey("q_post_task", "FJ")
                                                     .settings.log()
                                                     .wait()                                   
                                                     ,
                                                     getImage("picture_post_task")
                                                     .remove()
                                                     ,  
                                                     getKey("q_post_task")
                                                     .remove()
                                                     ,
                                                     newText("pleasewait2", "...")
                                                     .settings.css("font-size", "25px")
                                                     .settings.center()
                                                     .settings.bold()
                                                     .print()
                                                     ,
                                                     newTimer("wait2", 1000)
                                                     .start()
                                                     .wait()
                                                     ,
                                                     getText("pleasewait2")
                                                     .remove()
                                                     
                                                    )
                         .log("clickworkerID", getVar("cwID"))                         
                         .log("age", getVar("IDage"))
                         .log("sex", getVar("IDsex"))
                         .log("L2", getVar("IDling"))
                         .log("whichL2", getVar("IDund zwar"))
                         .log( "item" , variable.item )
                         .log( "type" , variable.type )              
                         .log( "version" , variable.version)
                         .log( "letter" , variable.letter)
                         .log( "sentence" , variable.sentence)
                         .log( "name" , variable.name)  
                         .log( "year" , variable.year)
                         .log( "fact" , variable.fact)
                         .log( "photo" , variable.file_name)
                         .log( "full_sentence" , variable.full_sentence)
                         .log( "condition" , variable.condition)
                         .log( "life_mismatch" , variable.life_mismatch)
                         .log( "fact_mismatch" , variable.fact_mismatch)
                         .log( "year_time" , variable.year_time)
                         .log( "fact_time" , variable.fact_time)
                         .log( "year_fact" , variable.year_fact)
                         .log( "list" , variable.list)
                         .log( "life_status" , variable.life_status)
                         .log( "yes_key" , variable.yes_F)
                         .log( "occupation" , variable.occupation)
                         .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
                         
                         .setOption("countsForProgressBar", false)    //overrides some default settings, such as countsForProgressBar
                         .setOption("hideProgressBar", true)
                        );  


//====================================================================================================================================================================================================================
// 10. End

PennController( "end_post_task",
                newText("<p><br>")
                .print()
                ,
                newButton("end_experiment" ,"Verst&auml;ndnistest beenden")
                .settings.center()
                .print()
                .wait()
                ,
                getButton("end_experiment")
                .remove()
               )
    
    .setOption("countsForProgressBar", false)    //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
/* 3. Post-experiment questionnaire

PennController("post-ques",
               newText("post-instruc", "Please answer the following questions about the experiment. <br>Try to be brief but informative.<p><p>")
               .settings.bold()
               .print()
               ,
               // Q1
               newText("notice", "1. Was there anything about the experiment that stood out to you? Any patterns/regularities, anything strange or surprising?")
               .print()
               ,
               newTextInput("notice","")
               .size(600,50)
               .print()
               .log()
               ,
               newText("blank", "<p>")
               .print()
               ,
               newButton("next1", "Next Question")
               .print()
               .wait()
               ,
               getButton("next1")
               .remove()
               ,
               // Q2
               newText("about", "2. What do you think the experiment might have been about? Make as many guesses as you like.")
               .print()
               ,
               newTextInput("about","")
               .size(600, 50)
               .print()
               .log()
               ,   
               newText("blank", "<p>")
               .print()
               ,            
               newButton("next2", "Next Question")
               .print()
               .wait()
               ,
               getButton("next2")
               .remove()
               ,
               //Q3
               newText("easyhard", "3. Was there anything you found particularly easy or difficult?")
               .print()
               ,
               newTextInput("easyhard","")
               .size(600, 50)
               .print()
               .log()
               ,     
               newText("blank", "<p>")
               .print()
               ,            
               newButton("next3", "Next Question")
               .print()
               .wait()
               ,
               getButton("next3")
               .remove()
               ,
               // Q4
               newText("strategy", "4. Did you use any strategies during the experiment? If so, what were they?")
               .print()
               ,
               newTextInput("strategy","")
               .size(600, 50)
               .print()
               .log()
               ,   
               newText("blank", "<p>")
               .print()
               ,              
               newButton("next4", "Finished")
               .print()
               .wait()
               ,
               // create Vars
               newVar("notice") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("notice") )
               ,
               newVar("about") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("about") )
               ,
               newVar("easyhard") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("easyhard") )
               ,
               newVar("strategy") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("strategy") )
              ) */









//====================================================================================================================================================================================================================
// 10. Send results

PennController.SendResults( "send" )
    
    .setOption("countsForProgressBar", false)    //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 11. Good-bye

PennController.Template(PennController.GetTable( "master_stimuli_spr.csv")// change this line for the appropriate experimental list
                        .filter("type" , "val_code")
                        ,  
                        variable => PennController( "final"
                                                    ,
                                                    newText("<p>Vielen Dank f&uuml;r Ihre Teilnahme an unserem Experiment!<p><br><b>Hier ist Ihr Validierungscode: "+variable.name+"F.</b><p><br>Bitte geben Sie diesen Code auf der Clickworker-Webseite ein, um Ihre Bezahlung zu erhalten.</p>")
                                                    .settings.css("font-size", "20px")
                                                    .settings.center()
                                                    .print()
                                                    ,
                                                    newButton("void")
                                                    .wait()
                                                   )
                        
                        .setOption("countsForProgressBar", false)    //overrides some default settings, such as countsForProgressBar
                        .setOption("hideProgressBar", true)
                       );


