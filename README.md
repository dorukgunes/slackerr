
Slackerr

=========

  

A small library that sends error to your slack channel

  

## Installation

  

`npm install slackerr --save`

  

## Usage

    const Slackerr = require('slackerr')
    const slackerr = new Slackerr('yourslackwebhookurl', {channel: "#errors", icon_emoji: ":boom:"})
    
    try{
	    throw new Error("example error")
    } catch(err) {
	    slackerr.report(err) // without extra detail
	    slackerr.report(err, {username: 'test'}) // with detail
    }
        
