# andasy.hcl app configuration file generated for room-chat on Friday, 24-Oct-25 01:31:27 CAT
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "room-chat"

app {

  env = {}

  port = 80

  compute {
    cpu      = 1
    memory   = 256
    cpu_kind = "shared"
  }

  process {
    name = "room-chat"
  }

}
