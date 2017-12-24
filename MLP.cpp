#include<iostream>
#include<cmath>
#include<cstdlib>
#include <vector>
#include<iomanip>
#include<fstream>
using namespace std;

struct song{
  string mood;
  double danceability;
  double energy;
  double key;
  double loudness;
  double mode;
  double speechiness;
  double acousticness;
  double instrumentalness;
  double liveness;
  double valence;
  double tempo;
  double duration_ms;
  double time_signature;
};
//max and mins for normalizing data set.
 double DMin = 999999;
 double DMax = -1;
 double EMin = 999999;
 double EMax = -1;
 double KMin = 999999;
 double KMax = -1;
 double LMin = 999999;
 double LMax = -1;
 double MMin = 999999;
 double MMax = -1;
 double SMin = 999999;
 double SMax = -1;
 double AMin = 999999;
 double AMax = -1;
 double IMax = 999999;
 double IMin = -1;
 double LiveMin = 999999;
 double LiveMax = -1;
 double VMin = 999999;
 double VMax = -1;
 double TMin = 999999;
 double TMax = -1;
 double DurationMin = 999999;
 double DurationMax = -1;
 double TimeSigMin = 999999;
 double TimeSigMax = -1;

const int setSize = 399;//should be 400 one of the songs was null
const int testSize = 4;

vector<song> set (setSize);//assuming the data set size we use is the same
song test[testSize];
int active[setSize];

//functions
void normalize();
void normalizeTest();
void readSet();
void readTests();
void setMinMax();
double sim(song a, song b);
int argMin(song a);
void reset();
string predicition(int K, int test);

int main(){
  int K3 = 3;
  int K5 = 5;
  int index = 0;
  readTests();
  readSet();
  setMinMax();
  normalize();
  normalizeTest();


  for( int i = 0; i<testSize;i++){
    for( int k = 0; k<5;k+=2){
      cout<<"For Test "<<i<<" with "<<k+1<<"-NN The predicition is "<<predicition(k+1,i)<<endl;
      reset();
    }
    cout<<endl;
  }
}
void setMinMax(){
  for( int i =0; i<setSize;i++){
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

void reset(){
  for(int i =0; i<setSize; i++)
  {
    active[i]=1;
  }
}

string predicition(int K, int testNum){
  double A = 0, B = 0, C = 0,D =0, k = K;
  for( int i = 0; i<K;i++)
  {
      if(set[argMin(test[testNum])].mood == "Angry"){
         A+=1;
      }
      else if(set[argMin(test[testNum])].mood == "Happy"){
         B+=1;
      }
      else if(set[argMin(test[testNum])].mood == "Sad"){
         C+=1;
      }
      else{
        D+=1;
      }
  }
  // A = A/K;
  // B = B/K;
  // C = C/K;
  // D = D/K;
  if((A)>(B) && (A)>(C) && (A)>(D)){
    return "Angry";
  }
  else if((B)>(A) && (B)>(C) && (B)>(D)){
    return "Happy";
  }
  else if((C)>(A) && (C)>(B) && (C)>(D)){
    return "Sad";
  }
  else{
    return "Chill";
  }
}

void readTests(){
  ifstream tests;
  tests.open("tests.txt");
  int i = 0;
  char cm;
  while(
    tests>>test[i].danceability>>cm>>test[i].energy>>cm>>test[i].key>>cm>>test[i].loudness
    >>cm>>test[i].mode
    >>cm>>test[i].speechiness
    >>cm>>test[i].acousticness
    >>cm>>test[i].instrumentalness
    >>cm>>test[i].liveness
    >>cm>>test[i].valence
    >>cm>>test[i].tempo
    >>cm>>test[i].duration_ms
    >>cm>>test[i].time_signature

  ){ i++; }
}
void readSet(){
  ifstream songs;
  songs.open("songs.txt");
  int i = 0;
  char cm;
  while(
    songs>>set[i].danceability>>cm>>set[i].energy>>cm>>set[i].key>>cm>>set[i].loudness
    >>cm>>set[i].mode
    >>cm>>set[i].speechiness
    >>cm>>set[i].acousticness
    >>cm>>set[i].instrumentalness
    >>cm>>set[i].liveness
    >>cm>>set[i].valence
    >>cm>>set[i].tempo
    >>cm>>set[i].duration_ms
    >>cm>>set[i].time_signature
    >>cm>>set[i].mood
  )
  {
    active[i]=1;
    i++;
  }
}
void normalize(){
  for( int i = 0; i< setSize; i++ ){
    set[i].danceability = (set[i].danceability - DMin) / (DMax - DMin);
      set[i].energy = (set[i].energy - EMin) / (EMax - EMin);
      set[i].key = (set[i].key - KMin) / (KMax - KMin);
      set[i].loudness = (set[i].loudness - LMin) / (LMax - LMin);
      set[i].mode = (set[i].mode - MMin) / (MMax - MMin);
      set[i].speechiness = (set[i].speechiness - SMin) / (SMax - SMin);
      set[i].acousticness = (set[i].acousticness - AMin) / (AMax - AMin);
      set[i].instrumentalness = (set[i].instrumentalness - IMin) / (IMax - IMin);
      set[i].liveness = (set[i].liveness - LiveMin) / (LiveMax - LiveMin);
      set[i].valence = (set[i].valence - VMin) / (VMax - VMin);
      set[i].tempo = (set[i].tempo - TMin) / (TMax - TMin);
      set[i].duration_ms = (set[i].duration_ms - DurationMin) / (DurationMax - DurationMin);
      set[i].time_signature = (set[i].time_signature - TimeSigMin) / (TimeSigMax - TimeSigMin);
  }
}
void normalizeTest(){
  for (int i = 0; i < testSize; i++) {
      test[i].danceability = (test[i].danceability - DMin) / (DMax - DMin);
      test[i].energy = (test[i].energy - EMin) / (EMax - EMin);
      test[i].key = (test[i].key - KMin) / (KMax - KMin);
      test[i].loudness = (test[i].loudness - LMin) / (LMax - LMin);
      test[i].mode = (test[i].mode - MMin) / (MMax - MMin);
      test[i].speechiness = (test[i].speechiness - SMin) / (SMax - SMin);
      test[i].acousticness = (test[i].acousticness - AMin) / (AMax - AMin);
      test[i].instrumentalness =  (test[i].instrumentalness - IMin) / (IMax - IMin);
      test[i].liveness = (test[i].liveness - LiveMin) / (LiveMax - LiveMin);
      test[i].valence = (test[i].valence - VMin) / (VMax - VMin);
      test[i].tempo = (test[i].tempo - TMin) / (TMax - TMin);
      test[i].duration_ms = (test[i].duration_ms - DurationMin) / (DurationMax - DurationMin);
      test[i].time_signature = (test[i].time_signature - TimeSigMin) / (TimeSigMax - TimeSigMin);
    }
}

double sim(song a, song b){
  double Danceability_Diff = a.danceability - b.danceability;
   double Energy_Diff = a.energy - b.energy;
   double Key_Diff = a.key - b.key;
   double Loudness_Diff = a.loudness - b.loudness;
   double Speech_Diff = a.speechiness - b.speechiness;
   double Accoustic_Diff = a.acousticness - b.acousticness;
   double Instrumentalness_Diff = a.instrumentalness - b.instrumentalness;
   double Liveness_Diff = a.liveness - b.liveness;
   double Valence_Diff = a.valence - b.valence;
   double Tempo_Diff = a.mode - b.mode;
   double Duration_Diff = a.duration_ms - b.duration_ms;
   double TimeSig_Diff = a.time_signature - b.time_signature;
   double distance = sqrt(
       pow(Danceability_Diff, 2) +
       pow(Energy_Diff, 2) +
       pow(Key_Diff, 2) +
       pow(Loudness_Diff, 2) +
       pow(Speech_Diff, 2) +
       pow(Accoustic_Diff, 2) +
       pow(Instrumentalness_Diff, 2) +
       pow(Liveness_Diff, 2) +
       pow(Valence_Diff, 2) +
       pow(Duration_Diff, 2) +
       pow(TimeSig_Diff, 2) +
       pow(Tempo_Diff, 2)
   );
   return distance;
}

int argMin(song a){
 double min = 9999999999999;
 int minIndex = 0;
  for( int i =0; i< setSize; i++){
    if(active[i]!=0){
      if((min > sim(a,set[i]))){
        min = sim(a,set[i]);
        minIndex = i;
      }
    }
  }
  active[minIndex]=0;//deactivate the index of min once its found
  return minIndex;
}
