#include<iostream>
#include<bits/stdc++.h>
using namespacestd;
class Superhero {
    public:
    int strength;
    int immunity;
    int defence;
    int attack;
    String power_source="Light"
    
    
};
class super_villain: public Superhero
{
    strength =100;
    immunity=100;
    defence=100;
    attack=95;
    power_source="Darkness";
    String Power_factor="negative";
    
    
    
};

int main(){
    Superhero Arjun;
    Arjun.strength=80;
    Arjun.immunity=98;
    Arjun.attack=99;
    
    Super_villain Shakuni;
    Shakuni.strength=40;
    Shakuni.immunity=90;
    Shakuni.attack=99;
    cout<<Arjun.strenth<<""<<Arjun.immunity<<" "<<Arjun.attack<<Arjun.power_source<<endl;
    cout<<Shakuni.strenth<<" "<<Shakuni.immunity<<" "<<Shakuni.attack<<" "<<Shakuni.power_source<<" "<<Power_factor;
    
    
}