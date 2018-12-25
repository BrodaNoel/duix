# DUIX
First of all: Why is it called "DUIX"? The `x` at the end is obvious: Becase it's a state manager. If you make your own state manager and you don't call it with an `x` at the end, please, don't do a state manager. On another hand the `dui` means: `DON'T USE IT`. So, you are already warned.


## Why "don't use it"?
Because if you saw (if not, you should) all the courses, tweets, videos and blogs from our almighty frontend community, you should already learned that EVERYTHING SHOULD BE DECLARATIVE. And this, my friend, is not declarative at all (and I hope to keep it as it is).

So...

## Why was it created?
Because some ~most~ of the current State Managers libs add too unnecessary complexity (even in the learning curve, or arch, or high coupling between components).

The idea of `duix` is to reuse some old knowledge to solve only one simple problem: Keep 2 components on sync.

There are 2 things that I keep on mind while working:
1. **KISS**: Keep it simple, stupid.
2. **Pareto principle**: The 80% and 20%. The 80% of your bugs, are gonna be always the same 2 or 3 issues that you always see in every project.

The KISS patter is very clear, but I believe the Pareto principle deserves more details:

I believe that if you added redux in 10 projects, you may added it 8 times just to solve 1 issue: "Keep a couple of vars on sync between components", and also 2 times that you solves tons of issues that it absolutelly worth it.
But, what about those 8 times that you added Redux only to keep 1 var on sync? You only needed a global state var and a callback, but you added Redux.

The idea of `duix` is to cover those 8 times that you added Redux only because you needed to keep on sync vars between components. Just that. There is a global `state` object, that you `set` values, or `get` values, and you can `subscribe` or `unsubscribe`, and every time someone `set` a new value, all the subscribers are gonna be called receiving the new and the old value.

I'm a React dev, and I used Redux a couple of times. After creating this tool (I was using it during one whole year), I used this tool in 5 projects, and I had to use Redux in only 1.

If your team is not feeling very well with the current State Managers complexity, I'd say that you should try this tool. But, due to it's not in the `declarative hype`, I'd preffer to say: DON'T USE IT!

## The `duix` approach
`duix` just have a state that is just a plain object, and some listeners (publish-subscribers) that are gonna be called every time the subscribed-value value change.

## The Counter Example
1. `Buttons` component is gonna add or subtract.
2. `Viewer` component is gonna show the value

```js
// index.js
import duix from 'duix';

// Set `null` as default `user` value
duix.set('githubStars', 0);

class App extends Component {
  // ...
}
```

```js
// Buttons.js
import duix from 'duix';

class Buttons extends Component {
  handleAdd = () => {
    const currentValue = duix.get('githubStars');
    duix.set('githubStars', currentValue + 1);
  };

  handleSubtract = () => {
    const currentValue = duix.get('githubStars');
    duix.set('githubStars', currentValue - 1);
  };

  // ...
}
```

```js
// Viewer.js
import duix from 'duix';

class Viewer extends Component {
  unsubscribe = [];
  state = {
    githubStars: duix.get('githubStars') // get initial value
  };

  componentDidMount() {
    this.unsubscribe[0] = duix.subscribe('githubStars', this.onStarsChange);
  }

  componentWillUnmount() {
    this.unsubscribe[0]();
  }

  onStarsChange = (githubStars) => {
    this.setState({ githubStars });
  };

  render() {
    return (
      <div className="Viewer">
        {this.state.githubStars} stars
      </div>
    );
  }
}
```

So, could you understand what happened there? Only 3 things on `duix`:
1. Someone needs to set the default value
2. Someone is gonna get the initial value, and also `subscribe` to the any change
4. Someone is gonna `set` the new value every time it have to be changed.

## The Login Example
1. The main file in the app define the initial value for the `user` object.
2. The `Header` component is subscribed to the changes of `user` (because if the `user` object is defined, the user is logged).
3. The `Login` component is gonna call a funcion that is gonna do the API call to check if the credentials are OK.
4. The `LogOut` component is gonna logout the user. :shrug:

The code:

```js
// index.js
import duix from 'duix';

// Set `null` as default `user` value
duix.set('user', null);

class App extends Component {
  // ...
}
```

```js
// Login.js
import duix from 'duix';
// Let's suppose this `actions` is an object with all the functions necessary to login an user
import { loginWithCredentials } from 'actions';

class Login extends Component {
  handleLogin = (email, password) => {
    // The `Login` component is not gonna change the `user` object. Instead, the `loginWithCredentials` is gonna do it.
    loginWithCredentials(email, password);
  };

  // ...
}
```

```js
// Logout.js
import duix from 'duix';

class Logout extends Component {
  handleLogout = (email, password) => {
    duix.set('user', null);
  };

  // ...
}
```

```js
// actions.js
import duix from 'duix';

export default {
  loginWithCredentials: (email, password) => {
    fetch(
      'http://example.com/api/login',
      // ...
    ).then(r => r.json())
    .then((user) => {
      /**
       * Whatever the backend send us, let's set it.
       *
       * Let's suppose the backend send `null` if the credentials were wrong,
       * or the proper `user` object if the credentials were OK.
       */
      duix.set('user', user);
    });
  }
};
```

```js
// Header.js
import duix from 'duix';

class Header extends Component {
  unsubscribe = [];
  state = {
    user: null
  };

  componentDidMount() {
    // Let's subscribe to the `user` changes
    this.unsubscribe[0] = duix.subscribe('user', this.onUserChange);
  }

  componentWillUnmount() {
    // Let's unsubscribe.
    this.unsubscribe[0]();
  }

  onUserChange = (user) => {
    this.setState({ user });
  };

  render() {
    return (
      <div className="Header">
        { this.state.user && `Hello ${this.state.user.name}` }
      </div>
    );
  }
}
```

So, could you understand what happened there? Only 3 things on `duix`:
1. Someone needs to set the default value
2. Someone is gonna `subscribe` to a value change, or unsubscribe when component unmount.
3. Someone is gonna `set` the new value every time it changes


"That's all, folks"
