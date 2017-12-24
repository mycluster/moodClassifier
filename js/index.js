//if not working we need to change token

app();
function app() {
  var doneCount = 0;
  
  grabSet();
  
  function grabSet() {
    //get playlist IDS from user
    //0-3 Chill, Angry, Sad, Happy//
    var startKNN = false;
    var playlistComplete = false;
    var user_id = "1258737726";
    var playlist_id = [];
    var features = [{}];
    var track_id = [{}];
    var token = `BQCqEz8xqYysBDluiuc4IJWErJVwNT0bk5o1hHvFpkfxPOw596FRVeGyf_fTDZ33t0uzvxN9PfHQYJ3UMbgLknS4jEy8svlCO73hCPjmUcmVVVGtQVWNLO_-zZFlpFhwLZfzgdve2dYL6suFcQ`;
    $.ajax({
      url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      },
      success: function(data) {
        data.items.forEach(function(el, index) {
          playlist_id[index] = el.id;
        });
        getTrackIds();
      }
    });
    
    function getTrackIds() {
      playlist_id.forEach(function(id, index) {
        let playlist = index;
        $.ajax({
          url: `https://api.spotify.com/v1/users/${user_id}/playlists/${id}/tracks`,
          beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
          },
          success: function(data) {
            data.items.forEach(function(el, track) {
              if (playlist === 0) {
                track_id.push({
                  class: "Chill",
                  id: el.track.id
                });
              }
              if (playlist === 1) {
                track_id.push({
                  class: "Angry",
                  id: el.track.id
                });
              }
              if (playlist === 2) {
                track_id.push({
                  class: "Sad",
                  id: el.track.id
                });
              }
              if (playlist === 3) {
                track_id.push({
                  class: "Happy",
                  id: el.track.id
                });
              }
            });
          },
          complete: function() {
            
            if (track_id.length === 401) {
                doneCount+=1;
                if(doneCount===4){
                  console.log("calling get features");
                  features = getFeatures();
                  console.log("features with the class", features);
                  //now call KNN on the given features
                  KNN(features);
                }
            }
          }
        });
      });
    }
   
    function getFeatures() {
      let tracks =[];
      let mood = [];
      mood[0] = track_id[1].class;
      mood[1] = track_id[101].class;
      mood[2] = track_id[201].class;
      mood[3] = track_id[301].class;
      console.log(mood);
      track_id.forEach(function(track, index) {
        tracks.push(track.id);
      });
      let cuts=[[]];
      cuts.push(tracks.slice(1,101));
      cuts.push(tracks.slice(101,201));
      cuts.push(tracks.slice(201,301));
      cuts.push(tracks.slice(301,401));
      cuts = cuts.splice(1,cuts.length);
      cuts.forEach(function(cut,index){
        let moodIndex = index;
        $.ajax({
          url: `https://api.spotify.com/v1/audio-features?ids=${cut.toString()}`,
          beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
          },
          success: function(data) {
           data.audio_features.forEach(function(feature,index){
             if(feature){
               //for .text format
              var line = `
                ${feature.danceability},${feature.energy},${feature.key},${feature.loudness},${feature.mode},${feature.speechiness},${feature.acousticness},
                ${feature.instrumentalness},${feature.liveness},${feature.valence},${feature.tempo},${feature.duration_ms},${feature.time_signature},${mood[moodIndex]}
              `;
             //for dat format  
                var line = `
                ${moodIndex+1} 1:${feature.danceability} 2:${feature.energy} 3:${feature.key} 4:${feature.loudness} 5:${feature.mode+1} 6:${feature.speechiness} 7:${feature.acousticness}
                8:${feature.instrumentalness} 9:${feature.liveness} 10:${feature.valence} 11:${feature.tempo} 12:${feature.duration_ms} 13:${feature.time_signature}
              `;
               
               
            
               console.log('line->>>',line);
             $("#demo").append( "<li>"+line+"</li>" );
             //console.log("current index for the mood",moodIndex);
              features.push({
                class: mood[moodIndex],
                danceability: feature.danceability,
                energy: feature.energy,
                key: feature.key,
                loudness: feature.loudness,
                mode: feature.mode,
                speechiness: feature.speechiness,
                acousticness: feature.acousticness,
                instrumentalness: feature.instrumentalness,
                liveness: feature.liveness,
                valence: feature.valence,
                tempo: feature.tempo,
                duration_ms: feature.duration_ms,
                time_signature: feature.time_signature
              });
           }
           });
          },
        });
    });
    
      //features = features.slice(1,features.length); Causing features to be changed into some weird array
      console.log(features[1]);
      return features;
    }
    return features;
  }

  //KNN

  var DMin = 999999;
  var DMax = -1;
  var EMin = 999999;
  var EMax = -1;
  var KMin = 999999;
  var KMax = -1;
  var LMin = 999999;
  var LMax = -1;
  var MMin = 999999;
  var MMax = -1;
  var SMin = 999999;
  var SMax = -1;
  var AMin = 999999;
  var AMax = -1;
  var IMax = 999999;
  var IMin = -1;
  var LiveMin = 999999;
  var LiveMax = -1;
  var VMin = 999999;
  var VMax = -1;
  var TMin = 999999;
  var TMax = -1;
  var DurationMin = 999999;
  var DurationMax = -1;
  var TimeSigMin = 999999;
  var TimeSigMax = -1;

  var testSize = 4;
  var active = [];

  function KNN(features) {
    var setSize = features.length;
    console.log("this working?",features[1]);
    var set = features;
    let test = readTests();
    //readSet();
    //setMinMax();
    //console.log("new DMIN",DMIN);
    //normalize();
    //normalizeTest();
    
    for (let i = 0; i < testSize; i++) {
      for (let k = 0; k < 5; k += 2) {
        console.log(
          "For Test " +
            i +
            " with " +
            (k + 1) +
            "-NN The predicition is " +
            predicition(test, k + 1, i)
        );
        reset();
      }
    }
  

  function setMinMax() {
    //MSAI
    console.log("in set min max",set[0].danceability);
    for (let i = 0; i < setSize; i++) {
      if (DMin > set[i].danceability) {
        DMin = set[i].danceability;
      }
      if (DMax < set[i].danceability) {
        DMax = set[i].danceability;
      }
      if (EMin > set[i].energy) {
        EMin = set[i].energy;
      }
      if (EMax < set[i].energy) {
        EMax = set[i].energy;
      }
      if (KMin > set[i].key) {
        KMin = set[i].key;
      }
      if (KMax < set[i].key) {
        KMax = set[i].key;
      }
      if (LMin > set[i].loudness) {
        LMin = set[i].loudness;
      }
      if (LMax < set[i].loudness) {
        LMax = set[i].loudness;
      }
      if (MMin > set[i].mode) {
        MMin = set[i].mode;
      }
      if (MMax < set[i].mode) {
        MMax = set[i].mode;
      }
      if (SMin > set[i].speechiness) {
        SMin = set[i].speechiness;
      }
      if (SMax < set[i].speechiness) {
        SMax = set[i].speechiness;
      }
      if (AMin > set[i].acousticness) {
        AMin = set[i].acousticness;
      }
      if (AMax < set[i].acousticness) {
        AMax = set[i].acousticness;
      }
      if (IMin > set[i].instrumentalness) {
        IMin = set[i].instrumentalness;
      }
      if (IMax < set[i].instrumentalness) {
        IMax = set[i].instrumentalness;
      }
      if (LiveMin > set[i].liveness) {
        LiveMin = set[i].liveness;
      }
      if (LiveMax < set[i].liveness) {
        LiveMax = set[i].liveness;
      }
      if (VMin > set[i].valence) {
        VMin = set[i].valence;
      }
      if (VMax < set[i].valence) {
        VMax = set[i].valence;
      }

      if (TMin > set[i].tempo) {
        TMin = set[i].tempo;
      }
      if (TMax < set[i].tempo) {
        TMax = set[i].tempo;
      }
      if (DurationMin > set[i].duration_ms) {
        DurationMin = set[i].duration_ms;
      }
      if (DurationMax < set[i].duration_ms) {
        DurationMax = set[i].duration_ms;
      }
      if (TimeSigMin > set[i].time_signature) {
        TimeSigMin = set[i].time_signature;
      }
      if (TimeSigMax < set[i].time_signature) {
        TimeSigMax = set[i].time_signature;
      }
    }
  }

  function reset() {
    for (let i = 0; i < setSize; i++) {
      active[i] = 1;
    }
  }

  function predicition(K, testNum) {
    var A = 0,
      B = 0,
      C = 0,
      D = 0,
      k = K;
    for (let i = 0; i < K; i++) {
      if (set[argMin(test[testNum])].Mood == "Angry") {
        A += 1;
      } else if (set[argMin(test[testNum])].Mood == "Happy") {
        B += 1;
      } else if (set[argMin(test[testNum])].Mood == "Sad") {
        C += 1;
      } else {
        D += 1;
      }
    }
    A = A / K;
    B = B / K;
    C = C / K;
    D = D / K;
    if (A > B && A > C && A > D) {
      return "Angry";
    } else if (B > A && B > C && B > D) {
      return "Happy";
    } else if (C > A && C > B && C > D) {
      return "Sad";
    } else {
      return "Chill";
    }
  }

  function readTests() {
    //AHSC
   let test = [];
    test.push({
      danceability: 0.572,
      energy: 0.853,
      key: 1,
      loudness: -3.203,
      mode: 1,
      speechiness: 0.217,
      acousticness: 0.0757,
      instrumentalness: 0,
      liveness: 0.0798,
      valence: 0.102,
      tempo: 171.297,
      duration_ms: 297893,
      time_signature: 4
    });

    test.push({
      danceability: 0.56,
      energy: 0.936,
      key: 3,
      loudness: -5.835,
      mode: 1,
      speechiness: 0.0439,
      acousticness: 0.00847,
      instrumentalness: 0,
      liveness: 0.161,
      valence: 0.371,
      tempo: 112.96,
      duration_ms: 218013,
      time_signature: 4
    });

    test.push({
      danceability: 0.243,
      energy: 0.215,
      key: 2,
      loudness: -21.08,
      mode: 1,
      speechiness: 0.123,
      acousticness: 0.899,
      instrumentalness: 0.00000777,
      liveness: 0.925,
      valence: 0.148,
      tempo: 89.984,
      duration_ms: 184306,
      time_signature: 4
    });

    test.push({
      danceability: 0.429,
      energy: 0.01,
      key: 2,
      loudness: -25.164,
      mode: 1,
      speechiness: 0.0537,
      acousticness: 0.992,
      instrumentalness: 0.945,
      liveness: 0.103,
      valence: 0.207,
      tempo: 74.677,
      duration_ms: 215500,
      time_signature: 1
    });
   test.forEach(function(feature, index) {
     if(feature){
    var line = `
                ${feature.danceability},${feature.energy},${feature.key},${feature.loudness},${feature.mode},${feature.speechiness},${feature.acousticness},
                ${feature.instrumentalness},${feature.liveness},${feature.valence},${feature.tempo},${feature.duration_ms},${feature.time_signature}
              `;
       //for svm dat
     // var line = `
     //            1:${feature.danceability} 2:${feature.energy} 3:${feature.key} 4:${feature.loudness} 5:${feature.mode+1} 6:${feature.speechiness} 7:${feature.acousticness}
     //            8:${feature.instrumentalness} 9:${feature.liveness} 10:${feature.valence} 11:${feature.tempo} 12:${feature.duration_ms} 13:${feature.time_signature}
     //          `;
    console.log('line->>>',line);
    $("#demo2").append( "<li>"+line+"</li>" );
     }
    });
   
    return test;
    
  }
  function readSet() {
    //set = grabSet();
    set = features;
    return set;
  }
  function normalize(setSize) {
    for (let i = 0; i < setSize; i++) {
      set[i].danceability = (set[i].danceability - DMin) / (DMax - DMin);
      set[i].energy = (set[i].energy - EMin) / (EMax - EMin);
      set[i].key = (set[i].key - KMin) / (KMax - KMin);
      set[i].loudness = (set[i].loudness - LMin) / (LMax - LMin);
      set[i].mode = (set[i].mode - MMin) / (MMax - MMin);
      set[i].speechiness = (set[i].speechiness - SMin) / (SMax - SMin);
      set[i].acousticness = (set[i].acousticness - AMin) / (AMax - AMin);
      set[i].instrumentalness =
        (set[i].instrumentalness - IMin) / (IMax - IMin);
      set[i].liveness = (set[i].liveness - LiveMin) / (LiveMax - LiveMin);
      set[i].valence = (set[i].valence - VMin) / (VMax - VMin);
      set[i].tempo = (set[i].tempo - TMin) / (TMax - TMin);
      set[i].duration_ms =
        (set[i].duration_ms - DurationMin) / (DurationMax - DurationMin);
      set[i].time_signature =
        (set[i].time_signature - TimeSigMin) / (TimeSigMax - TimeSigMin);
    }
  }
  function normalizeTest() {
    for (let i = 0; i < testSize; i++) {
      test[i].danceability = (test[i].danceability - DMin) / (DMax - DMin);
      test[i].energy = (test[i].energy - EMin) / (EMax - EMin);
      test[i].key = (test[i].key - KMin) / (KMax - KMin);
      test[i].loudness = (test[i].loudness - LMin) / (LMax - LMin);
      test[i].mode = (test[i].mode - MMin) / (MMax - MMin);
      test[i].speechiness = (test[i].speechiness - SMin) / (SMax - SMin);
      test[i].acousticness = (test[i].acousticness - AMin) / (AMax - AMin);
      test[i].instrumentalness =
        (test[i].instrumentalness - IMin) / (IMax - IMin);
      test[i].liveness = (test[i].liveness - LiveMin) / (LiveMax - LiveMin);
      test[i].valence = (test[i].valence - VMin) / (VMax - VMin);
      test[i].tempo = (test[i].tempo - TMin) / (TMax - TMin);
      test[i].duration_ms =
        (test[i].duration_ms - DurationMin) / (DurationMax - DurationMin);
      test[i].time_signature =
        (test[i].time_signature - TimeSigMin) / (TimeSigMax - TimeSigMin);
    }
  }

  function sim(a, b) {
    var Danceability_Diff = a.danceability - b.danceability;
    var Energy_Diff = a.energy - b.energy;
    var Key_Diff = a.key - b.key;
    var Loudness_Diff = a.loudness - b.loudness;
    var Speech_Diff = a.speechiness - b.speechiness;
    var Accoustic_Diff = a.acousticness - b.acousticness;
    var Instrumentalness_Diff = a.instrumentalness - b.instrumentalness;
    var Liveness_Diff = a.liveness - b.liveness;
    var Valence_Diff = a.valence - b.valence;
    var Tempo_Diff = a.mode - b.mode;
    var Duration_Diff = a.duration_ms - b.duration_ms;
    var TimeSig_Diff = a.time_signature - b.time_signature;
    var distance = Math.sqrt(
      Math.pow(Danceability_Diff, 2) +
        Math.pow(Energy_Diff, 2) +
        Math.pow(Key_Diff, 2) +
        Math.pow(Loudness_Diff, 2) +
        Math.pow(Speech_Diff, 2) +
        Math.pow(Accoustic_Diff, 2) +
        Math.pow(Instrumentalness_Diff, 2) +
        Math.pow(Liveness_Diff, 2) +
        Math.pow(Valence_Diff, 2) +
        Math.pow(Duration_Diff, 2) +
        Math.pow(TimeSig_Diff, 2) +
        Math.pow(Tempo_Diff, 2)
    );
    return distance;
  }

  function argMin(a) {
    var min = 9999999999999;
    var minIndex = 0;
    for (var i = 0; i < setSize; i++) {
      if (active[i] != 0) {
        if (min > sim(a, set[i])) {
          min = sim(a, set[i]);
          minIndex = i;
        }
      }
    }
    active[minIndex] = 0; //deactivate the index of min once its found
    return minIndex;
  }
  
  function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}
  
}
}