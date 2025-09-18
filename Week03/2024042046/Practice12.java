public class Practice12 { // ReturnArray

    static int[] makeArray() {
        int temp[] = new int[4];
        for(int i=0; i<temp.length; i++)
            temp[i]=i; // 배열을 0,1,2,3으로 초기화
        return temp;
    }

    public static void main(String[] args) {
        int intArray[];
        intArray = makeArray();
        for(int i=0; i<intArray.length; i++)
            System.out.print(intArray[i]+" ");
    }
}
