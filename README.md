# DUIX
First of all: Why is it called "DUIX"? The `x` at the end is obvious: Becase it's a state manager. If you make your own state manager and you don't call it with an `x` at the end, please, don't do a state manager. On another hand the `dui` means: `DON'T USE IT`. So, you are already warned.


## Why "don't use it"?
Because if you saw (if not, you should) all the courses, tweets, videos and blogs from our almighty frontend community, you should already learned that EVERYTHING SHOULD BE DECLARATIVE. And this, my friend, is not declarative at all (and I hope to keep it as it is).

So...

## Why was it created?
Because some ~most~ of `*x` add unnecessary complexity.

The idea of `duix` is to reuse some old knowledge to solve only one simple problem: Keep 2 components on sync.

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
4. Someone is gonna `set` the new value every time it changes

## The Login Example
1. The main file in the app define the initial value for the `user` object.
2. The `Header` component is subscribed to the changes of `user`.
3. The `Login` component is gonna call a funcion that is gonna made the API call to check if the user is logged.
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
import { login } from 'actions';

class Login extends Component {
  handleLogin = (email, password) => {
    login.withCredentials(email, password).then((user) => {
      duix.set('user', user);
    });
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
  login: {
    withCredentials: (email, password) => {
      fetch(
        'http://example.com/api/login',
        // ...
      ).then(r => r.json())
      .then((user) => {
        /**
         * Here, let's suppose that the backend return `null` if
         * the user is wrong, or the user object if the login is correct
         */
        duix.set('user', user);
      });
    }
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
    this.unsubscribe[0] = duix.subscribe('user', this.onUserChange);
  }

  componentWillUnmount() {
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
2. Someone is gonna `subscribe` to a value change
3. Someone is gonna `set` the new value every time it changes


"That's all, folks"
