export class APIHelper {
  static readonly HOST = "http://localhost:3195";

  static async GET(url: string) {
    const request = await fetch(APIHelper.HOST + url);
    return await request.json();
  }

  static async POST(url: string, data: any) {
    const request = await fetch(APIHelper.HOST + url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });

    return await request.json();
  }

  static async GetInventory() {
    return await APIHelper.GET("/inventory");
  }

  static async SendMessage(message: string, session: number) {
    return await APIHelper.POST("/send", { message, username: session });
  }
}
