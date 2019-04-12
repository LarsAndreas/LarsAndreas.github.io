#include <stdio.h>
 
int main()
{
    char word[100];
    printf("Enter word\n");
    gets(word);

    char displayWord[100];
    while(1 > 0){
        char z[1];
        printf("Enter a character\n");
        gets(z);

        int i;
        for(i = 0; i < 100; i = i + 1 ){
            if(word[i] == z) {
                displayWord[i] = z;
            }
        }
        printf(displayWord);
    }
   return 0;
}