export const getHighScore = async () => {
  const highScore = localStorage.getItem("highScore");
  return highScore ? +highScore : 0
}

export const setHighScore =  async (highScore: number) => {
  localStorage.setItem("highScore", `${highScore}`)
}

export type Classname = string | Record<string, boolean>;

export const clsx = (...classnames: (Classname | undefined | null)[]) =>
	(classnames.filter(Boolean) as Classname[])
		.reduce(
			(cns, cn) =>
				typeof cn === "string"
					? [...cns, cn]
					: [
							...cns,
							...Object.entries(cn)
								.filter(([, value]) => value)
								.map(([c]) => c),
					  ],
			[] as string[]
		)
		.join(" ");

export class Listeners<T extends Record<string | symbol | number, (...params: any[]) => void>> {
  private listeners: {
    [key in keyof T]?: Set<T[key]>
  } = {}

  addListener<K extends keyof T>(key: K, listener: T[K]) {
    if (this.listeners[key]) {
      this.listeners[key]?.add(listener);
    } else {
      this.listeners[key] = new Set([listener])
    }
  }

  runListeners<K extends keyof T>(key: K, ...params: Parameters<T[K]>) {
    const listeners = this.listeners[key]?.values()
    if (!listeners) return;
    for (const listener of listeners) {
      listener(...params)
    }
  }

  deleteListeners<K extends keyof T>(key: K) {
    delete this.listeners[key];
  }

  deleteListener<K extends keyof T>(key: K, listener: T[K]) {
    this.listeners[key] && this.listeners[key]?.delete(listener);
  }
}

export const clearCanvas = (ctx: CanvasRenderingContext2D) => {
  const {width, height} = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
}