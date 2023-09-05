import * as trackers from "@/trackers";
import { init, stop } from "@/main";

describe("Trackers", () => {
  beforeEach(() => {
    document.body.innerHTML = `
        <div class="outer">
          <div id="middle" class="middle">
            <div class="inner super-inner">Inner Text</div>
          </div>
        </div>
      `;

    // @ts-ignore
    window.screen.orientation = { type: "" };

    for (const trackerKey in trackers) {
      jest.spyOn(trackers[trackerKey], "track");
    }

    init("test-app-id", "http://localhost:3000");
  });

  afterEach(() => {
    jest.clearAllMocks();
    stop();
  });

  it("should track all registered events", () => {
    const eventNames = [];

    for (const trackerKey in trackers) {
      eventNames.push(...trackers[trackerKey].eventNames);
    }

    for (const eventName of eventNames) {
      const element = document.querySelector("div.inner") as HTMLElement;
      const event = new Event(eventName, { bubbles: true });
      element.dispatchEvent(event);
    }

    for (const trackerKey in trackers) {
      expect(trackers[trackerKey].track).toBeCalledTimes(
        trackers[trackerKey].eventNames.length
      );
    }
  });

  it('should be able to "screenshot" the dom', async () => {
    const event = await trackers.UITracker.trackDOMChange();

    expect(event).toMatchObject({
      type: "ui",
      name: "dom-change",
      path: "html",
      properties: {
        scrollX: expect.any(Number),
        scrollY: expect.any(Number),
        screen: {
          availHeight: expect.any(Number),
          availWidth: expect.any(Number),
          height: expect.any(Number),
          width: expect.any(Number),
          orientation: expect.any(String),
        },
        location: { origin: expect.any(String), pathname: expect.any(String) },
        screenshot: expect.stringContaining("</html>"),
      },
      timestamp: expect.any(Number),
      sessionId: expect.any(String),
    });
  });
});
