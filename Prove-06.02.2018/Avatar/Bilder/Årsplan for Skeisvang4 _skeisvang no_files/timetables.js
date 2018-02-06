//show timetables

var tpath = '';      // path taken for this timeplan
var itemtype = '';   // itemtype for last viewed timetable teach,stud,room


function show_date(jd) {
  var startjd = 7 * Math.floor(jd  / 7);
  var startdate = julian.jdtogregorian(startjd);
  var enddate = julian.jdtogregorian(startjd+6);
  if (startdate.year == enddate.year) {
     var dato = "" + startdate.day + "." + startdate.month
         + "-" + enddate.day + "." + enddate.month + " " + startdate.year;
  } else {
     var dato = "" + startdate.day + "." + startdate.month + "." + startdate.year + " - "
                + enddate.day + "." + enddate.month + "." + enddate.year;
  }
  return dato;
}

function show_thisweek(delta) {
    // viser denne uka, årsplanen + timeplan
    //var uid = userinfo.id;
    isteach = (userinfo && userinfo.department) ? userinfo.department === 'Undervisning' : isteach;
    promises.toggle_year = function() {
          show_thisweek(delta);
        };
    delta = typeof(delta) != 'undefined' ?  +delta : 0;  // vis timeplan for en anne uke
    var uid = database.userinfo.id || 0;
    var s='<div id="timeviser"><h1 id="oskrift">'+user+'</h1>';
    s+= '<div id="sectionimg"></div>';
    s+= '<div id="timeplan"></div>';
    s+= '<div id="workplan"></div>';
    s+= '<div id="weekly"></div>';
    s+= "</div>";
    $j("#main").html(s);
    if (showyear == 1) {
      var bquote = 'Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment. ';
      if (database.quizbase && database.quizbase.quotes) {
          var idx = Math.floor(Math.random()*database.quizbase.quotes.stuff.length);
          var quo = database.quizbase.quotes.stuff[idx];
          bquote = quo.future ? quo.future : bquote;
      }

      $j("#timeplan").html(bquote+' '+usersonline);
      return;
    }
    // last inn årsplan-data for denne uka
    //var enr = uid
    var userlist = '';
    var e;
    var thisweek = database.startjd + delta*7;
    var dato = show_date(thisweek);
    s = getYearPlanThisWeek(thisweek);
    $j("#weekly").html(s);
    if (inlogged && isteach) {
      $j("#workplan").delegate("span.wb","click",function() {
          var myid = this.id;
          workbook(myid);
      });
      $j("#timeplan").delegate("div.meet","click",function() {
          var myid = this.id;
          myMeetings(myid,delta);
      });
    } else {
      $j("#workplan").delegate("span.workbook","click",function() {
          var myid = this.id;
          workbook(myid);
      });
    }
    var planliste = '';
    var mos = 0;
    if (courseplans) {
      // courseplan.mos is the category that this user mos-tly belongs to
      // courseplan.plan is the workplan for this user
      var courseplan = addonCoursePlans(delta);
      mos = courseplan.mos;
      $j("#workplan").html(courseplan.plan);
    } else {
      if (!promises.allplans) promises.allplans = {};
      promises.allplans.thisweek = function() { var courseplan = addonCoursePlans(delta); $j("#workplan").html(courseplan.plan); };
        // promise to draw up workplan when we get it
    }
    if (timetables) {
      addonTimePlan(delta,mos);
      // addonTimePlan will update html for #timeplan (with bgimg given by mos)
    } else {
      if (!promises.timetables) promises.timetables = {};
      promises.timetables.thisweek = function() { addonTimePlan(delta,0); };
        // promise to draw up timetable when we get it
    }
}


/**
 *  Splits a text based on TEACH and ADMIN, returns the parts
 *  @param {string} txt
 *  @return {object}  { any:txt, admin:txt, teach:txt }
 **/
function teachAdminTxt(txt) {
    txt = txt ? txt : '';
    var infoad = txt.replace("ADMIN","€").replace("TEACH","£");
    var elm = infoad.split(/£|€/);
    var anycansee = elm[0];
    var admintxt = infoad.match(/€([^€£]+)/);
    var teachtxt = infoad.match(/£([^€£]+)/);
    return { any:anycansee, admin:(admintxt ? admintxt[1] : ''), teach:(teachtxt ? teachtxt[1] : '')};
}


function getYearPlanThisWeek(thisweek) {
  // fetch weekly summary from yearplan
    isteach = (userinfo && userinfo.department) ? userinfo.department === 'Undervisning' : isteach;
    var s = '<table id="mytime" class="timeplan" >';
    var header = [];
    e = database.yearplan[Math.floor(thisweek/7)] || { days:[]} ;
    for (var j=0;j<6;j++) {
        var infotxt = teachAdminTxt(e.days[j] || '');
        var anycansee = infotxt.any;
        var admcansee = (infotxt.admin && isadmin  ) ? ('<span class="redfont">'+infotxt.admin+'</span>') : '';
        var teachcansee = (infotxt.teach && isteach  ) ? ('<span class="bluefont">'+infotxt.teach+'</span>') : '';
        var txt = anycansee + admcansee + teachcansee ;
        header[j] = txt || '';
        var hd = database.heldag[thisweek+j];
        if (hd) {
          header[j] += '<ul class="hdliste">';
          for (var f in hd) {
            f = f.toUpperCase();
            var cat = +database.category[f] || 0
            header[j] += '<li class="catt'+cat+'">'+f+'&nbsp;'+hd[f].value+'</li>';
          }
          header[j] += '</ul>';
        }
    }
    s += "<tr>";
    for (i=0;i<6;i++) {
        s += "<th>" + dager[i] + "</th>";
    }
    s += "</tr>";
    s += "<tr>";
    for (i=0;i<6;i++) {
        s += "<th class=\"dayinfo\">" + header[i] + "</th>";
    }
    s += "</tr></table>";
    return s;
}

function addonTimePlan(delta,mos) {
      var thisweek = database.startjd + delta*7;
      var uid = database.userinfo.id || 0;
      var userplan = getuserplan(uid);
      var s = vistimeplan(userplan,uid,'','isuser',delta);
      $j("#timeplan").html(s);
      $j("#sectionimg").addClass('sect'+mos);
      //$j(".totip").tooltip();
      $j(".totip").tooltip({position:"bottom right" } );
      $j(".goto").click(function() {
              var fagnavn = $j(this).attr("tag");
              if (fagnavn.substr(0,5).toUpperCase() == 'STARB' 
                         || fagnavn.substr(0,2) == 'Rå'
                         || fagnavn.substr(0,4) == 'UTDV'
                         || fagnavn.substr(0,2) == 'TP') {
                if (inlogged && isteach) {
                  var room = $j(this).attr("room");
                  var day = $j(this).attr("day");
                  if (database.thisjd >= thisweek + +day)
                     regstarb(thisweek + +day,room);
                }
              } else {
                var plandata = courseplans[fagnavn];
                visEnPlan(fagnavn,plandata);
              }
          } );
      $j("#oskrift").html('Uke '+julian.week(thisweek)+' <span title="'+thisweek+'" class="dato">'+show_date(thisweek)
                   +'</span><span title="Abonner på kalender" class="ical"></span>');
      $j("#nxt").click(function() {
          if (database.startjd+7*delta < database.lastweek+7)
            show_thisweek(delta+1);
          });
      $j("#prv").click(function() {
          if (database.startjd+7*delta > database.firstweek-7)
            show_thisweek(delta-1);
          });
      $j("#oskrift").undelegate(".ical","click");
      $j("#oskrift").delegate(".ical","click",function() {
            var txt = $j("#timeplan table caption").text();
            var uname = txt.match(/<(.+)>/);
            alert("exporting calendar "+uname[1]);
          });


}

function addonCoursePlans(delta) {
    var thisweek = database.startjd + delta*7;
    var uid = database.userinfo.id || 0;
    var planliste = '';
    var mos = 0;
    if (timetables && timetables.teach) {
      planliste = vis_fagplaner(uid,thisweek);
      var minefag = getfagliste(uid);
      var sect = "";
      // mostly is which category this teach/stud mostly belongs to
      var mostly = {0:0};
      for (var i in minefag) {
         var fag = minefag[i].split('_')[0];
         var cat = database.category[fag];
         if (!mostly[cat]) mostly[cat] = 0;
         mostly[cat]++;
         if (mostly[cat] >= mostly[mos]) mos = cat;
      }
    }
    return {plan:planliste,mos:mos };
}




function build_timetable(timeplan,plan,filter,planspan) {
    // fills in a table with events from a plan
     var spanstart = typeof(planspan) != 'undefined' ? '<span class="'+planspan+'">' : '';
     var spanend   = typeof(planspan) != 'undefined' ? '</span>' : '';
     var spa,sto;
     var i,j,pt,room,cell;
     var clean = {};      // just coursename - no formating
     var cleanroom = {};  // just room names
     for (i=0; i< plan.length;i++) {
        spa = spanstart; sto = spanend;
        pt = plan[i];
        if (pt[2]) cell = pt[2].replace(' ','_');
        if (!timeplan[pt[1]]) {     // ingen rad definert ennå
            timeplan[pt[1]] = {};   // ny rad
            clean[pt[1]] = {};      // ny rad
            cleanroom[pt[1]] = {};  // ny rad
        }
        if (!clean[pt[1]]) {     // ingen rad definert ennå
            clean[pt[1]] = {};      // ny rad
            cleanroom[pt[1]] = {};  // ny rad
        }
        clean[pt[1]][pt[0]]     = cell;
        cleanroom[pt[1]][pt[0]] = pt[3];
        cell = '<span tag="'+cell+'" day="'+pt[0]+'" room="'+pt[3]+'" class="goto">'+cell+'</span>';
        if (!planspan && timeplan[pt[1]][pt[0]]) continue; // only add multiple if we have planspan
        if (!timeplan[pt[1]][pt[0]]) {    // no data assigned yet
           timeplan[pt[1]][pt[0]] = '';   // place empty string so we can += later
        }
        room = (pt[3] == 'nn') ? '' : pt[3];
        room = (pt[4] && filter != 'RAD' ) ? "&nbsp;<span class=\"rombytte\">=&gt;&nbsp;" + pt[4] + "</span>" : '&nbsp;'+room ;
        cell += room;
        if (plan.prover[ pt[1] ] && plan.prover[ pt[1] ] [ pt[0] ] ) {
          if (plan.prover[ pt[1] ] [ pt[0] ] != 1 ) {
              spa = '<span class="timeprove">';
              cell = plan.prover[ pt[1] ] [ pt[0] ];
              if ($j.isArray(cell)) {
                //cell = cell.join(' ');
                // this is a group - just assign subj+room
                cell = clean[pt[1]][pt[0]] + room;
              }
              cell = cell.replace('eksamen','eks');
              sto = '</span>';
          } else {
            if (spanstart) {
              spa = '<span class="'+planspan+' timeprove">';
            } else {
              spa = '<span class="timeprove">';
              sto = '</span>';
            }
          }
        }
        if (timeplan[pt[1]][pt[0]] == spa + cell + sto) continue;
        // don't add if we already have exact same data
        timeplan[pt[1]][pt[0]] += spa + cell + sto;
     }
     return {timeplan:timeplan, clean:clean, cleanroom:cleanroom, plan:plan};
}


function makepop(cell,userlist,username,gruppe,filter,heading) {
    // lag en css:hover som viser elever i en gruppe
    // denne funksjonen er memoized - den husker på
    // elevlista for tuple (gruppe,username)
    if (gruppe && popmemoizer[cell+gruppe+username]) {
        return popmemoizer[cell+gruppe+username];
        // only memoize if gruppe defined
    }
    if (userlist) {
        var elev;
        var elist = [];
        if (heading) {
            elist.push(heading);
        }
        var ce;
        var glist;
        if (filter == 'group') {
            glist = memberlist[username];
        }
        for (var i=0; i< userlist.length;i++) {
            elev = id2elev[userlist[i]];
            if (elev && elev.department)  {
                if (filter == 'klasse' && username && elev.department && elev.department != username) continue;
                if (filter == 'group' && ($j.inArray(elev.id,glist) < 0) ) continue;
                elist.push(""+elev.firstname.caps()+" "+elev.lastname.caps()+" "+elev.department);
            }
        }
        ce = '<li><a href="#">'+((""+cell).substr(0,5))+'</a><ul class="gui"><li><a href="#">'
            + elist.join('</a></li><li><a href="#">')
            + '</a></li></ul></li>';
    } else {
        ce = '<li><a href="#">'+cell+'</a></li>';
    }
    if (gruppe) popmemoizer[cell+gruppe+username] = ce;
    return ce;
}


function getAbsentBecauseTest(jd,fagliste) {
  // given a list of courses
  // returns a list of absent students for given week
  var heldag = [];
  var hd = database.heldag[jd];
  for (fag in hd) {
    if ($j.inArray(fag.toUpperCase(),fagliste.fag) != -1) {
      var ahd = hd[fag];
      var slots = null;
      if (ahd.value == 'eksamen' || ahd.value == 'forb') {
        continue;   // ignore eksams and prep days as we have no idea who will be chosen
      }
      // some whole day tests are only half day (some slots may be unaffected)
      if (ahd.klass == 1) {
        slots = ahd.value.match(/\((.+)\)/)[1].split(/[, +]/);
      }
      heldag.push( { hd:fag+' '+ahd.value, slots:slots, elever:fagliste.fagelev[fag] } );
    }
  }
  return heldag;
}

// given a slot label like '8.05-8.45' returns [0,8]
// each slot is 5 minutes
// assumes GLOBAL startslot = start[0]
var startslot=0;
function s2sd(sl) {
  var elm = sl.split('-');
  var t1 = elm[0].split('.');
  var t2 = elm[1].split('.');
  var t10 = +t1[0];
  var t11 = +t1[1];
  var t20 = +t2[0];
  var t21 = +t2[1];
  var slot = t10*12+Math.floor(t11/5) - startslot;
  var dur = Math.floor(((t20-t10)*60+t21-t11) / 5);
  return [slot,dur];
}


function build_plantable(jd,uid,username,timeplan,xtraplan,filter,edit) {
  // using divs for timetable layout
  var start = database.starttime;
  startslot =  startslot || s2sd(start[0])[0];  // the first slot in starttime defines slot-zero
  edit = typeof(edit) != 'undefined' ? edit : false;
  var members = username;
  var blowup = 3;  // scale up if class with xtraplan
  if (isteach && inlogged && memberlist && memberlist[username]) {
        // this is a timetable for a group/class
        // show members as a list in caption (on hover)
        var userlist = memberlist[username];
        members = makepop(members,userlist,username,'','');
        members = '<ul id="members" class="gui nav small">' + members + '</ul>'
                  + '<div id="starb" class="button gui">Starb</div>';
        if (xtraplan) {
            blowup = 6;
        }
  }
  var isAroom = database.roomids[uid] !== undefined;
  var slotlabs = [] ;
  var numslots = database.slots;
  var numdays = database.days;
  var roomdescript = '';       // extra description for some rooms - empty for other item types
  if (database.roominfo[uid]) {
      numslots = database.roominfo[uid].slots || database.slots;
      numdays = database.roominfo[uid].days || database.days;
      slotlabs = database.roominfo[uid].slabels || '';
      slotlabs = slotlabs.split(',');
      roomdescript = database.roominfo[uid].info || '';
  }
  members += ' ' + roomdescript;
  var full = {};  // block doubles as they are not easy to read
  var limit = Math.max(numslots,slotlabs.length);  // how many lesson-slots to draw (a lesson is 8 slots = 40 min)
  var i,j;
  var r = '';  // absent students
  var s = '';  // timetable
  var t = '';  // header
  var u = '';  // grid
  var uu = ''; // edit-grid
  var v = '';  // tests
  var w = '';  // freedays
  var otherLessons = '';  // overlay showing other lessons where students are split into groups
                          // this info is stored in xtraplan
  members = '<div class="button blue gui" id="prv">&lt;</div>'+members+'<div class="button blue gui" id="nxt">&gt;</div>';
  t += '<div><div style="position:relative; text-align:center;">'+ss.timetable.timetablefor+members+"</div></div>";
  var cell,xcell,bad,subject;
  var plan = timeplan.plan;
  var colorid = 0;
  var usedcolor = {};
  var mycol = 0;
  var absentDueTest = {};
  var absentDueOther = {};  // excursions etc
  var already = {};  // to avoid doubles in list of absentees
  for (i=0; i< plan.length;i++) {
    var pt = plan[i];
    if (_.isEmpty(pt)) continue;
    var dday = pt[0];
    var sslo = pt[1];
    var subj = pt[2];
    var info = subj;  // info to show in plan - default is subject
    var room = pt[3];
    var teach = teachers[pt[5]];
    var hhi = Math.min(8,pt[6]);  // size of timeslot in minutes
    limit = Math.max(limit,Math.floor((sslo+hhi)/8));
    // block doubles
    if (!full[dday]) full[dday] = {};
    if (!full[dday][sslo]) {
        full[dday][sslo] = 1;
        if (!teachers[uid] && teach) {
            // student,group,class,room - show name of teach instead of group
            info = subj.split('_')[0] + '&nbsp;'+ teach.username;
        }
        if (usedcolor[subj] != undefined) {
          mycol = usedcolor[subj];
        } else {
          mycol = colorid;
          usedcolor[info] = mycol;
          colorid++;
        }
        cell = '<span tag="'+subj+'" day="'+dday+'" room="'+room+'" class="goto">'+info+'&nbsp;'+room+'</span>';
        s += '<div class="s'+mycol+' ttab'+dday+'" style="top:'
            + (24+sslo*blowup) + 'px;height:'+(hhi*blowup)+'px"><div class="retainer">' + cell  +'</div></div>';
    }
    // this is prepping for next overlay
    // build list of absent students for lessons
    var grname = subj.split('_')[1];
    var elever = memberlist[grname];
    if (elever != undefined && elever.length > 0) {
      if (!absentDueTest[dday+"_"+grname]) {
        var andre = getOtherCG(elever);
        var ablist = getAbsentBecauseTest(jd+dday,andre);
        if (ablist.length) {
           // must loop thru list - may be more than one
           // must use already to avoid doubles
           var testreason = [];
           var ec = 0;
           var stu = [];
           for ( var ai = 0; ai < ablist.length; ai++) {
             var abby = ablist[ai];
            if (abby.slots != undefined) {
                   var less = slot2lesson(sslo);
                   if ($j.inArray(""+(+less+1),abby.slots) == -1) continue;
                   // this is not a whole day test - skip if unaffected slot
            }
            testreason.push(abby.hd);
            for (var el in abby.elever) {
                var elev = abby.elever[el];
                if (students[elev] && !already[elev+"_"+dday+"_"+sslo] ) {
                     already[elev+"_"+dday+"_"+sslo] = 1;
                     stu.push(short_sweet_name(elev));
                    ec++;
                    }
                }
            }
            if (ec > 0) {
                absentDueTest[dday+"_"+grname] = { studs:stu, count:ec, test:testreason.join(','), nuslot:[] };
            }
        }
      }
      // build list of studs who are absent (not due test - mostly excursions)
      // this is based on slot/day - not group/day as for dueTest
      if (absent[jd+dday]) {
        var ec = 0;
        var stu = [];
        var ab = absent[jd+dday];
        for (var el in elever) {
            var elev = elever[el];
            if (ab[elev] ) { // one of my studs is absent
                var slots = ab[elev].value.split(',');
                for (var sl in slots) {
                    var slo = lesson2slot(+slots[sl]-1);
                    if (slo == sslo) {
                          // this stud is absent during course slot
                        ec++;
                        stu.push(short_sweet_name(elev)+'&nbsp;'+ab[elev].name);
                        break;
                    }
                }
            }
        }
        if (ec>0) {
          // some studs on excursion this slot/day
          absentDueOther[dday+"_"+sslo] = { count:ec, stu:stu};
        }
      }
      if (absentDueTest[dday+"_"+grname]) {
              absentDueTest[dday+"_"+grname].nuslot.push(sslo);
      }
    }
  }
  var th = (54+limit*8*blowup);
  // overlay showing absent students due test
  for (var jg in absentDueTest) {
      for (var ii = 0; ii < absentDueTest[jg].nuslot.length; ii++) {
        var abbys = absentDueTest[jg];
        var tss   = abbys.nuslot[ii];
        var count = abbys.count;
        var jj = jg.split('_')[0];
        var info = '<table><tr><th>'+abbys.test+'</th></tr><tr><td>'
                      +abbys.studs.join('</td></tr><tr><td>')+'</tr></table>';
        r += '<div class="ttabs totip " title="'+info+'" style="left:'+(155+130*(+jj))+'px; top:'+(25+tss*blowup)+'px;">'+(count)+'</div>';
      }
  }
  // overlay showing absent students due excursion
  for (var jg in absentDueOther) {
        var abbys = absentDueOther[jg];
        var count = abbys.count;
        var jj = jg.split('_')[0];
        var jjj = jg.split('_')[1];
        var info = '<table><tr><th>Absent</th></tr><tr><td>'
                      +abbys.stu.join('</td></tr><tr><td>')+'</tr></table>';
        r += '<div class="ttabs totip gradbackgreen" title="'+info+'" style="left:'+(168+130*(+jj))+'px; top:'+(25+jjj*blowup)+'px;">'+(count)+'</div>';
  }
  for (i=0;i<limit;i++) {
    var sl = slotlabs[i] || start[i];
    var po = s2sd(sl);
    u += '<div class="ttim tttime'+(i%2)+'" style="top:'+(24+po[0]*blowup)+'px;height:'+(po[1]*blowup)+'px">' + sl + "</div>";
  }
  for (i=0;i<numdays;i++) {
        u += '<div class="tthead" style="height:'+(th)+'px; left:'+(60+i*130)+'px">' + romdager[i] + "</div>";
        if (database.freedays[jd+i]) {
           w += '<div class="ttfree" style="height:'+(th-144)+'px; left:'+(60+i*130)+'px">' + database.freedays[jd+i] + "</div>";
        }
  }
  if (edit) {
      // add cells for editing timetable
      for (i=0;i<limit;i++) {
        var sl = slotlabs[i] || start[i];
        var po = s2sd(sl);
        for (j=0;j<numdays;j++) {
          uu += '<div class="edit" id="ee'+(i + '_'+j)+'" style="top:'+(24+po[0]*blowup)+'px;left:'+(60+j*130)+'px;height:'+(po[1]*blowup)+'px"></div>';
        }
      }
  }
  // add on a layer showing tests
  if (timeplan.plan.prover.tests) {
    for (var jjd in timeplan.plan.prover.tests) {
      var testday = jjd-jd;
      if (testday > 6) continue;
      var tpplist = timeplan.plan.prover.tests[jjd];
      for (var jj=0; jj<tpplist.length; jj++) {
        var tpp = tpplist[jj];
        var sslo = tpp.value.split(',');
        for (var ii =0; ii < sslo.length; ii++) {
          var ssl = sslo[ii];
          var ttop = lesson2slot(ssl-1);
          v += '<div class="tttest" style="left:'+(60+130*testday)+'px; top:'+(24+ttop*blowup)+'px;"></div>';
        }
      }
    }
  }
  // add on a layer showing other lessons
  if (xtraplan) {
      for (var sslot in xtraplan) {
          var poo = xtraplan[sslot];
          for (var dday in poo) {
              var pood = poo[dday];
              var other;
              if (isAroom) {
                other = (_.isArray(pood)) ? '<ul class="timeblob">'+pood.join('</ul><ul class="timeblob">') + '</ul>'
                        :  '<ul class="timeblob">'+pood + '</ul>';
              } else {
                other = (_.isArray(pood)) ? '<ul class="nav small">'+pood.join('</ul><ul class="nav small">') + '</ul>'
                        :  '<ul class="gui nav small">'+pood + '</ul>';
              }
              //var other = '<ul class="nav small">'+poo[dday].join('</ul><ul class="nav small">') + '</ul>';
              //var other = '<ul class="gui nav small">'+poo[dday][0] + '</ul>';
              otherLessons += '<div class="other s'+mycol+' ttab'+dday+'" style="top:'
                + (24+sslot*blowup) + 'px;height:'+(8*blowup)+'px;"><div class="retainer small">' + other +'</div></div>';
          }
      }
  }
  if (meetings) {
    for (i=0;i<numdays;i++) {
      if (meetings[jd+i] && meetings[jd+i][uid]) {
        var mlist = meetings[jd+i][uid];
        for (var ii=0; ii < mlist.length; ii++) {
            var mee = mlist[ii];
            v += '<div title="'+mee.name+' '+mee.value+ '" class="meet" style="height:'+(mee.dur*blowup)+'px; left:'+(60+130*mee.day)
               +'px; top:'+(24+mee.slot*blowup)+'px;">'+mee.name+'</div>';
        }
      }
    }
  }
  return t+'<div class="ttab" style="height:'+(th+3*blowup)+'px">'+u+uu+s+v+r+w+otherLessons+'</div>';
}



function updateMemory() {
    if (! jQuery.isEmptyObject(timeregister)) {
        var s = '<ul id="memul">';
        for (var i in timeregister) {
            s += '<li>' + i + '</li>';
        }
        s += '</ul>';
        $j("#memlist").html(s);
    }
}


function vistimeplan(data,uid,filter,isuser,delta,edit) {
  relax(30000);   // slow down live test;
  delta = typeof(delta) != 'undefined' ?  +delta : 0;  // vis timeplan for en anne uke
  edit = typeof(edit) != 'undefined' ? edit : false;
  // viser timeplan med gitt datasett
  var plan = data.plan;
  var timeplan = {};
  var xtraplan = {};
  var i,j;
  var cell,userlist,gruppe,popup,user,username;
  if (!plan) plan = {};
  var jd = database.startjd + 7*delta;
  plan.prover = add_tests(uid,jd);
  if (isuser != 'isuser' && memberlist[uid]) {
    // this is a group or class
    var elever = memberlist[uid];
    var andre = getOtherCG(elever);
    plan.prover = grouptest(plan.prover, andre.gru, jd);
  }
  //if (isuser != 'isuser' && timetables.room[uid]) {
  if (isuser != 'isuser' ) {
    // this is a room/group/course
    xtraplan = getReservations(uid,delta);
  }
  valgtPlan = plan;        // husk denne slik at vi kan lagre i timeregister
  if (filter == 'group' || filter == 'room' || filter == 'klass' || filter == 'gr' || filter == 'fg') {
    user = {firstname:uid,lastname:''};
  } else {
    user = (teachers[uid]) ?  teachers[uid] : (students[uid]) ? students[uid] : {firstname:'', lastname:''};
  }
  var username = user.firstname.caps() + ' ' + user.lastname.caps();
  // hent ut ekstraplanen - skal vises som css:hover
  if (data.xplan) {
     var xplan = data.xplan;
     for (i=0; i< xplan.length;i++) {
         var pt = xplan[i];
         if (!pt) continue;
         // pt = [1,7,"1mt5_1st2","a002","",1361]
         var cell = pt[2].replace(' ','_');
         gruppe = cell.split('_')[1];
         // add in tests for group
         if (!xtraplan[pt[1]]) {
             xtraplan[pt[1]] = {};
         }
         if (!xtraplan[pt[1]][pt[0]]) xtraplan[pt[1]][pt[0]] = [];
         userlist = intersect(memberlist[gruppe],elever);
         if (plan.prover[pt[1]] && plan.prover[pt[1]][pt[0]]) {
             if ($j.inArray(gruppe,plan.prover[pt[1]][pt[0]]) != -1) {
               cell = '<span class="redfont">'+cell+'</span>';
             }
         }
         popup = makepop(cell,userlist,username,gruppe,filter);
         xtraplan[pt[1]][pt[0]].push(popup);
     }
  }
  // hent ut normalplanen - skal vises som ren text
  timeplan = build_timetable(timeplan,plan,filter);
  //var ss = build_plantable(jd,uid,username.trim(),timeplan,xtraplan,filter);
  var ss = build_plantable(jd,uid,$j.trim(username),timeplan,xtraplan,filter,edit);
  return ss;
}


function intersect(a,b) {
  // array of elements present in both arrays a,b
  if (!b) return [];
  if (!a) return [];
  var inter = [];
  for (var i in a) {
    var elm = a[i];
    if ($j.inArray(elm,b) != -1) inter.push(elm);
  }
  return inter;
}

var deltamemory = 0;   // so that we can leaf thru timeplans for chosen week


function vis_timeplan_helper(userplan,uid,filter,isuser,visfagplan,delta,edit) {
  // timeplanen er henta - skal bare vises
  visfagplan = typeof(visfagplan) != 'undefined' ? visfagplan : false;
  edit = typeof(edit) != 'undefined' ? edit : false;
  delta = typeof(delta) != 'undefined' ?  +delta : 0;  // vis timeplan for en anne uke
  deltamemory = delta;
  var current = database.startjd + 7*delta;
  s = vistimeplan(userplan,uid,filter,isuser,delta,edit);
  if (!edit && visfagplan) {
    if (courseplans) {
      s += vis_fagplaner(uid,current);
    } else {
      if (!promises.allplans) promises.allplans = [];
      promises.allplans.timetable = function() { var courseplan = vis_fagplaner(uid,current); $j("#timeplan").append(courseplan); };
    }
  }
  var myinf = {};
  var freetime = {};  // hash used by timeplan editor - blocked if defined for a slot
  if (database.userinfo.isadmin && edit) {
    var fagliste = '';
    if (database.teachcourse[uid]) fagliste = '<div>'+database.teachcourse[uid].map(function(e,i) {
        return '<span tag="course" class="ccc course">'+e+'</span>'; }
        ).join(' ') + '</div>';
    var romliste = '<div>' + database.roomnamelist.map(function(e,i) {
        return '<span tag="room" class="ccc room">'+e+'</span>'; }
        ).join(' ') + '</div>';
    $j("#timed").html(fagliste+romliste);
    $j("#timed").undelegate(".ccc","click");
    $j("#timed").delegate(".ccc","click",function() {
          var tag = $j(this).attr("tag");
          $j("."+tag).removeClass('redfont');
          $j(this).addClass('redfont');
          $j(".goto").removeClass("blockedgroup");
          $j(".goto").removeClass("blockedroom");
          $j(".goto").removeClass("blockedteach");
          myinf[tag] = $j(this).text();
          freetime.blocked = [ {},{},{},{},{},{},{} ];
          if (myinf.room && myinf.course) {
            var rtt = timetables.room[myinf.room];
            var gtt = timetables.course[myinf.course];
            var ttt = timetables.teach[uid];
            // block by room
            for (var ri in rtt) {
              var rit = rtt[ri];
              freetime.blocked[ rit[0] ][ rit[1] ] = rit[2]+rit[3];
              $j("#"+uid+"_"+rit[0]+'_'+rit[1]).addClass("blockedroom");
            }
            // block by course
            for (var gi in gtt) {
              var git = gtt[gi];
              freetime.blocked[ git[0] ][ git[1] ] = git[2]+git[3];
              $j("#"+uid+"_"+git[0]+'_'+git[1]).addClass("blockedgroup");
            }
            // block by teach
            if (ttt) for (var ti=0; ti < ttt.length; ti++) {
              var tit = ttt[ti];
              freetime.blocked[ tit[0] ][ tit[1] ] = tit[2]+tit[3];
              //$j("#"+uid+"_"+tit[0]+'_'+tit[1]).addClass("blockedteach");
            }
            /*
            var ccgg = myinf.course.split('_');
            var cc = ccgg[0], gg = ccgg[1];
            var studs = database.memlist[gg];
            if (timetables.stud) {
              for (var i=0; i< studs.length; i++) {
                stid = studs[i];

              }
            }
            */
          }

        });
  }
  $j("#timeplan").html(s);
  $j("#starb").click(function() {
            tabular_view(uid);
        });
  //console.log(tpath+uid);
  $j(".totip").tooltip({position:"bottom right" } );
  if (!edit) $j(".goto").click(function() {
            var fagnavn = $j(this).attr("tag");
            var plandata = courseplans[fagnavn];
            visEnPlan(fagnavn,plandata);
        } );

  $j("#oskrift").html(ss.week.caps()+' '+julian.week(current)+' <span title="'+current+'" class="dato">'+show_date(current)
            +'</span><a href="#" title="Abonner på kalender" class="ical"></a>');
  if (edit && database.userinfo.isadmin) {
   $j("#timeplan").undelegate(".edit","click");
   $j("#timeplan").delegate(".edit","click",function() {
      var myid = $j(this).attr("id").substr(2).split('_');
      myinf.tid  =  document.getElementById("velgbruker").value;
      myinf.day  = myid[1];
      myinf.slot = lesson2slot(myid[0]);
      if (freetime.blocked && freetime.blocked[myinf.day][myinf.slot]) {
        alert("blocked");
      } else {
          if (myinf.room && myinf.course) {
            var roomid = database.roomids[myinf.room];
            var courseid = database.cname2id[myinf.course];
            $j("#oskrift").html('<span class="redfont">Saving ...</span>');
            $j.post(mybase+ "/log/save_timetable", { teachid:myinf.tid, rid:roomid, cid:courseid,
                 name:myinf.course, value:myinf.room,
                 day:myinf.day, slot:myinf.slot },function(msg) {
                 $j("#oskrift").html('<span class="redfont">'+msg.msg+'</span>');
                 $j.getJSON(mybase+ "/log/timetables",
                   function(data) {
                     timetables = unflatten(data.flatlist);
                     vis_valgt_timeplan({id:uid}, filter,visfagplan,isuser,edit);
                   });
             });
          } else {
              alert("deleting");
          }
      }
   });
  }
  $j(".ical").attr("href",mybase + "/ical?action=yearplan&filename=timeplan&type="+itemtype+"&itemid="+uid);
  $j("#nxt").click(function() {
        if (database.startjd+7*delta < database.lastweek+7)
           vis_timeplan_helper(userplan,uid,filter,isuser,visfagplan,delta+1);
      });
  $j("#prv").click(function() {
        if (database.startjd+7*delta > database.firstweek+7)
           vis_timeplan_helper(userplan,uid,filter,isuser,visfagplan,delta-1);
      });
}



function vis_valgt_timeplan(user,filter,visfagplan,isuser,edit) {
    // gitt en userid vil denne hente og vise en timeplan
    eier = user;
    edit = typeof(edit) != 'undefined' ? edit : false;
    // if user is name of klass or group then getcourseplan
    var userplan = (user.id) ? getuserplan(user.id) : getcourseplan(user,deltamemory) ;
    // rooms need delta cause they need to show reservations
    var uid = user.id || user;
    if (!edit) $j.bbq.pushState(tpath+uid);
    vis_timeplan_helper(userplan,uid,filter,isuser,visfagplan,deltamemory,edit);
}


function vis_timeplan(s,bru,filter,isuser,edit) {
    // filter is used by vistimeplan to filter members of groups
    // so that when we look at a class - then we only see class members
    // in lists for other groups
    edit = typeof(edit) != 'undefined' ? edit : false;
    deltamemory = 0;
    s += setup_timeregister();
    s+= '<div id="timeplan"></div>';
    s+= "</div>";    // this div is set up in the calling function
    $j("#main").html(s);
    updateMemory();
    // legg denne planen i minne dersom bruker klikker på husk
    $j("#push").click(function() {
       if (valgtPlan) {
           addToMemory(valgtPlan);
           updateMemory();
       }
    });
    $j("#klasseprove").click(function() {
       if (itemtype == 'klass') {
        var idx = $j("#velgbruker option:selected").val();
        var elever = memberlist[bru[idx]];
        var andre = getOtherCG(elever);
        var allgroups = andre.gru;
        allgroups = allgroups.concat(andre.fag);
        allgroups = _.object(allgroups,allgroups); // convert array to object - for quick lookup
        show_alleprover('',allgroups,bru[idx]);
       }
    });
    $j("#velgbruker").change(function() {
       var idx = $j("#velgbruker option:selected").val();
       vis_valgt_timeplan(bru[idx],filter,isuser,isuser,edit);
    });
}

function vis_gruppetimeplan() {
    itemtype = 'group';
    var bru = database.groups;
    var ant = bru.length;
    var s='<div id="timeviser"><h1 id="oskrift">'+ss.timetable.groupplans+'</h1>';
    s+= '<div class="gui" id=\"velg\">'+ss.timetable.choosegroup+'<select id="velgbruker">';
    s+= '<option value="0"> --velg-- </option>';
    var sorted = [];
    for (var i=0;i< ant; i++) {
       var e = bru[i], fagnavn = e;
       if ($j.inArray(e,database.classes) >= 0) continue;
       if (database.grcourses[e]) {
         var grc = database.grcourses[e];
         if (grc.length == 1) fagnavn = grc[0] + "_" + e;
         sorted.push({text:fagnavn,idx:i});
       }
    }
    sorted.sort(function (a,b) { return (a.text > b.text) ? 1 : -1 });
    for (var str in sorted) {
      var elm = sorted[str];
      s+= '<option value="'+elm.idx+'">' + elm.text  +  "</option>";
    }
    s+= "</select></div>";
    tpath = '#timeplan/group/';
    vis_timeplan(s,bru,'gr',false );
}

function vis_klassetimeplan() {
    itemtype = 'klass';
    var bru = database.classes;
    var ant = bru.length;
    var s='<div id="timeviser"><h1 id="oskrift">Klasse-timeplaner</h1>';
    s+= '<div class="gui" id=\"velg\">Velg klassen du vil se timeplanen for <select id="velgbruker">';
    s+= '<option value="0"> --velg-- </option>';
    for (i=0;i< ant; i++) {
       e = bru[i];
       s+= '<option value="'+i+'">' + e  +  "</option>";
    }
    s+= "</select> <span id=\"klasseprove\"> prover</span></div>";
    tpath = '#timeplan/klass/';
    vis_timeplan(s,bru,'kl',false );
}

function vis_samlingtimeplan() {
    itemtype = 'combo';
    var jd = database.startjd;
    var s='<div id="timeviser"><h1 id="oskrift">Sammensatt-timeplan</h1>';
    s+=  '<p>Velg timeplaner fra de andre menyene (elev,lærer,klasse) og '
       + ' marker at du vil ha dem med i samlingen. Kom tilbake til denne sida'
       + ' for å se den samla timeplanen. (denne sida er ikke ferdig)</p>';
    var timeplan = {timeplan:{}};
    var j=1;
    for (var i in timeregister) {
        timeplan = build_timetable(timeplan.timeplan,timeregister[i],'','p'+j);
        j++;
    }
    s += build_plantable(jd,0,'sammensatt gruppe',timeplan,{});
    s += '</div>';
    $j("#main").html(s);
}


function vis_romtimeplan() {
    itemtype = 'room';
    var bru = allrooms;
    var ant = bru.length;
    var s='<div id="timeviser"><h1 id="oskrift">Rom-timeplaner</h1>';
    s+= '<div class="gui" id=\"velg\">Velg rommet du vil se timeplanen for <select id="velgbruker">';
    s+= '<option value="0"> --velg-- </option>';
    for (var i in bru) {
       var e = bru[i];
       s+= '<option value="'+i+'">' + e  +  "</option>";
    }
    s+= "</select></div>";
    tpath = '#timeplan/room/';
    vis_timeplan(s,bru,'ro',false );
}

function vis_elevtimeplan() {
    itemtype = 'stud';
    var s='<div id="timeviser"><h1 id="oskrift">Elev-timeplaner</h1>';
    s+= '<div class="gui" id=\"velg\">Velg elev du vil se timeplanen for <select id="velgbruker">';
    s+= '<option value="0"> --velg-- </option>';
    for (var i in studentIds) {
       var idx = studentIds[i];  // stud-ids are in sorted order, students are ordered by id .. not so nice
       var e = students[idx];
       s+= '<option value="'+idx+'">' + e.department + " " + " " + e.institution+ " " + e.lastname.caps() + " " + e.firstname.caps()  +  "</option>";
    }
    s+= "</select></div>";
    tpath = '#timeplan/stud/';
    vis_timeplan(s,students,'non','isuser' );
}

function vis_teachtimeplan() {
    itemtype = 'teach';
    var s='<div id="timeviser"><h1 id="oskrift">Lærer-timeplaner</h1>';
    s+= '<div class="gui" id="velg">Velg lærer du vil se timeplanen for <select id="velgbruker">';
    s+= '<option value="0"> --velg-- </option>';
    var sorted = [];
    for (var i in teachers) {
       e = teachers[i];
       sorted.push({text:e.username + " " + e.lastname.caps() + " " + e.firstname.caps(), idx:i});
    }
    sorted.sort(function (a,b) { return (a.text > b.text) ? 1 : -1 });
    for (var str in sorted) {
      var elm = sorted[str];
      s+= '<option value="'+elm.idx+'">' + elm.text  +  "</option>";
    }
    s+= "</select></div>";
    tpath = '#timeplan/teach/';
    vis_timeplan(s,teachers,'teach','isuser');
}

function edit_teachtimeplan() {
    itemtype = 'teach';
    var s='<div id="timeviser"><h1 id="oskrift">Edit teach-timetables</h1>';
    s+= '<div class="gui" id="velg">Velg lærer du vil redigere timeplanen for <select id="velgbruker">';
    s+= '<option value="0"> --velg-- </option>';
    var sorted = [];
    $j.post(mybase+ "/log/save_timetable", { teachid:0 },function(msg) {
                 $j.getJSON(mybase+ "/log/timetables", { reload:1 },
                   function(data) {
                     timetables = unflatten(data.flatlist);
                   });
           } );
    for (var i in teachers) {
       e = teachers[i];
       sorted.push({text:e.username + " " + e.lastname.caps() + " " + e.firstname.caps(), idx:i});
    }
    sorted.sort(function (a,b) { return (a.text > b.text) ? 1 : -1 });
    for (var str in sorted) {
      var elm = sorted[str];
      s+= '<option value="'+elm.idx+'">' + elm.text  +  "</option>";
    }
    s += "</select></div>";
    s += '<div id="timed" class="centered"></div>';
    tpath = '#timeplan/teach/';
    vis_timeplan(s,teachers,'teach','isuser',true );
}

function getcourseplan(cgr,delta) {
  delta = typeof(delta) != 'undefined' ?  +delta : 0;  // vis timeplan for en anne uke
  // We want a timetable for a course/group/room
  // just try each in turn and return first found
  if (timetables && timetables.course[cgr]) {
    var elever = memberlist[cgr];
    var andre = getOtherCG(elever);
    var xplan = [];
    for (gr in andre.gru) {
      // get timetables for all other groups for these studs
      if (timetables.group[gr] ) xplan.push(timetables.group[gr]);
    }
    return {plan:timetables.course[cgr]};
  }
  if (timetables && timetables.group[cgr]) {
    var elever = memberlist[cgr];
    var andre = getOtherCG(elever);
    var xplan = [];
    for (gri in andre.gru) {
      // get timetables for all other groups for these studs
      var gr = andre.gru[gri];
      if (gr == cgr) continue;  // ignore the original group
      xplan = xplan.concat(timetables.group[gr]);
    }
    return {xplan:xplan, plan:timetables.group[cgr]};
  }
  if (timetables.room[cgr]) {
    return {plan:timetables.room[cgr]};
  }
  return {plan:[]};
}

function getReservations(room,delta) {
    var reserved = [];
    if (reservations) {
        for (var jd = database.startjd+delta*7; jd < database.startjd+(1+delta)*7; jd++) {
            if (reservations[jd]) {
                var reslist = reservations[jd];
                for (var r in reslist) {
                    var res = reslist[r];
                    if (res.name == room) {
                        var teach = teachers[res.userid];
                        if (teach && teach.username == res.value) {
                            res.value = teach.firstname.caps() + " " + teach.lastname.caps();
                        }
                        if (!reserved[res.slot]) reserved[res.slot] = [];
                        if (res.eventtype == 'hd') {
                          reserved[res.slot][res.day] = '<div class="rcorner gradbackred textcenter">' + res.value + '</div>';
                        } else if (database.userinfo.isadmin || res.userid == database.userinfo.id) {
                          reserved[res.slot][res.day] = '<div class="rcorner gradbackgreen textcenter">' + res.value + '</div>';
                        } else {
                          reserved[res.slot][res.day] = '<div class="rcorner gradbackgray textcenter">' + res.value + '</div>';
                        }
                    }
                }
            }
        }
    }
    return reserved;
}


function getOtherCG(studlist) {
  // given a list of students
  // returns other groups and courses that
  // are connected to these studs
    var fag = [];
    var gru = [];
    var blok = [];
    var fagelev = {};
    for (var eid in studlist) {
        var elev = studlist[eid];
        var egru = memgr[elev];
        for (var egid in egru) {
            var eg = egru[egid];
            if (eg == null) continue;
            if ($j.inArray(eg,gru) == -1) {
                gru.push(eg);
                // find the block for this group
                var bb = eg.substr(0,2);
                if (!isNaN(bb)) {
                  blok.push(bb);
                }
            }
            var fgru = database.grcourses[eg];
            for (var fid in fgru) {
              var efg = fgru[fid];
              if (!fagelev[efg]) fagelev[efg] = [];
              fagelev[efg].push(elev);
              if ($j.inArray(efg,fag) == -1) {
                  fag.push(efg);
              }
            }
        }
    }
    return {fag:fag, gru:gru, fagelev:fagelev, blok:blok };
}







function getuserplan(uid) {
  // assume timetables is valid
  // use memgr to pick out all groups
  // build up a timetable from timetables for each group
  if (timetables && timetables.teach[uid]) {
    // we have a teach - just pick out timetable.
    return {plan:timetables.teach[uid]};
  } else {
    var usergr = memgr[uid] || null;
    if (usergr) {
      var myplan = [];
      for (var i in usergr) {
        var group = usergr[i];
        for (var j in timetables.group[group]) {
          myplan.push(timetables.group[group][j]);
        }
      }
      return { plan:myplan };
    }
  }
  return [];
}

function coursetests(coursename,jd) {
  // returns list of tests for given course
  // { jdmonday:[{day:0..4, slots:"1,2,3"}]  }
  // the key is jd for monday each week with test, value is list of tests {day,slots}
  var prover = {};
  for (jd= database.firstweek; jd < database.lastweek; jd += 7) {
    for (var day = 0; day<5; day++) {
      // database.heldag[i]
      if (alleprover[jd + day]) {
        for (var pr in alleprover[jd + day]) {
          var pro = alleprover[jd + day][pr];
          if (coursename != pro.shortname) continue;
          if (!prover[jd]) {
            prover[jd] = [];
          }
          prover[jd].push( { day:day, slots:pro.value } );
        }
      }
    }
  }
  return prover;
}


function grouptest(prover,grouplist,jd) {
  // updates table of tests for given grouplist, given jd
  // assumes jd is monday of desired week
  for (var day = 0; day<5; day++) {
    if (alleprover[jd + day]) {
      for (var pr in alleprover[jd + day]) {
        var pro = alleprover[jd + day][pr];
        var coursename = pro.shortname;
        var ccgg = coursename.split('_');
        var cc = ccgg[0], gg = ccgg[1];
        //if (group != gg) continue;
        if ($j.inArray(gg,grouplist) == -1) continue;
        var elm = pro.value.split(',');  // get the slots for this test
        for (var k in elm) {
          var slot = +elm[k]-1;
          if (slot < 0) slot = 0;
          if (!prover[slot]) {    // ingen rad definert ennå
              prover[slot] = {};  // ny rad
          }
          if (!prover[slot][day]) {    // mangler kolonne
              prover[slot][day] = [];  // ny kolonne
          }
          prover[slot][day].push(gg);
        }
      }
    }
  }
  return prover;
}


function add_tests(uid,jd) {
  // returns table of tests for uid for given week
  // assumes jd is monday of desired week
  var prover = {};
  if (uid.length) return prover;  // this is not a user id (most likely a course/group)
  var mysubj = getUserSubj(uid);  // list of courses - groups for this stud
  prover.tests = {};   // store info about test indexed by jd for next 4 weeks
  var faggrupper = getUserSubj(uid);
  for (var day = 0; day<28; day++) {
    if (!timetables.teach[uid]) {
      var hd =  database.heldag[jd+day] || {} ;
      for (fag in hd) {
          if (faggrupper[fag]) {
            if (!prover.tests[jd+day]) {
              prover.tests[jd+day] = [];
            }
            prover.tests[jd+day].push({ shortname:fag,value:hd[fag].value });
            for (var dd=0; dd < 9; dd++) {
              if (!prover[dd]) {    // make new entry
                  prover[dd] = {};
              }
              var hdf = hd[fag].value.replace('heldag','hd').replace('hovedmål','hm').replace('sidemål','sm');
              prover[dd][day] = fag + ' ' + hdf;
            }
          }
      }
    }
    if (alleprover[jd + day]) {
      for (var pr in alleprover[jd + day]) {
        var pro = alleprover[jd + day][pr];
        var coursename = pro.shortname;
        var ccgg = coursename.split('_');
        var cc = ccgg[0], gg = ccgg[1];
        if (!(mysubj[coursename] || mysubj[cc] && mysubj[gg])) continue;
        if (!prover.tests[jd+day]) {
          prover.tests[jd+day] = [];
        }
        prover.tests[jd+day].push(pro);      // used in show_next4 to mark days with tests
        if (day > 4) continue;
        // build timetable for this week
        var elm = pro.value.split(',');  // get the slots for this test
        for (var k in elm) {
          var slot = +elm[k]-1;
          if (!prover[slot]) {    // ingen rad definert ennå
              prover[slot] = {};  // ny rad
          }
          prover[slot][day] = 1;
        }
      }
    }
  }
  return prover;
}


function setup_timeregister() {
    // tegner gui for timeplan-minne
    var s = '<div id="push" class="button posbut gui">husk</div>';
    s += '<div id="minne" class="memory gui"><h4>Minne</h4><div id="memlist"></div></div>';
    return s;
}



function addToMemory() {
    // legger til en ny bruker til minnet
    //if (valgtPlan && eier && eier.username) {
    if (valgtPlan) {
        var username = eier.username || eier;
        if (!timeregister[username]) {
           timeregister[username] = valgtPlan;
        }
    }
}

