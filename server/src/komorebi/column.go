package komorebi

import (
	"log"
	"time"
)

type Column struct {
	Id        int    `json:"id"`
	Name      string `json:"name"`
	Position  int    `json:"position"`
	BoardId   int    `json:"boardId"`
	CreatedAt int64  `json:"created_at"`
}

type Columns []Column

func NewColumn(name string, position int, boardId int) Column {
	return Column{
		CreatedAt: time.Now().UnixNano(),
		Name:      name,
		Position:  position,
		BoardId:   boardId,
	}
}

func (c Column) Save() bool {
	if c.Id == 0 {
		if errInsert := dbMapper.Connection.Insert(&c); errInsert != nil {
			log.Fatalln("save of board failed", errInsert)
			return false
		}
	} else {
		if errUpdate := dbMapper.Connection.Update(&c); errUpdate != nil {
			log.Fatalln("save of board failed", errUpdate)
			return false
		}
	}
	return true
}

func (c Column) Validate() (bool, string) {
	success, message := true, ""

	if len(c.Name) <= 0 {
		log.Println("Column validation failed. Name not present")
		success = false
		message += "Name not present.\n"
	}

	board := GetBoardColumnViewById(c.BoardId)
	if board.Id == 0 && board.CreatedAt == 0 {
		log.Println("Column validation failed. BoardId does not exist:", c.BoardId)
		success = false
		message += "Board does not exist.\n"
	}

	for _, column := range board.Columns {
		if column.Name == c.Name {
			log.Println("Column validation failed. Name not uniq")
			success = false
			message += "Name not uniq.\n"
		}
		if column.Position == c.Position {
			log.Println("Column validation failed. Position not uniq")
			success = false
			message += "Position not uniq.\n"
		}
	}
	return success, message
}
