public class practice01 {
	int radius;
	String name;
	public practice01(){}
	public double getArea() {
		return 3.14*radius*radius;
	}
	
	public static void main (String[]args) {
        practice01 pizza;
		pizza = new practice01();
		pizza.radius = 10;
		pizza.name = "자바피자";
		double area = pizza.getArea();
		System.out.println(pizza.name + "의 면적은" + area);

        practice01 donut = new practice01();
		donut.radius = 2;
		donut.name = "자바도넛";
		area = donut.getArea();
		System.out.println(donut.name + "의 면적은" + area);
	}
}
